let express = require('express');
let router = express.Router();
let csrf = require('csurf');
const passport = require('passport');
let Result = require('../models/result');
let User = require('../models/user');
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");


const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "Profile",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({ storage: storage });

let csrfProtection = csrf();
router.use(csrfProtection);

router.get('/app', function (req, res, next) {
  res.render('app', { csrfToken: req.csrfToken() });
});

router.get('/save', isLoggedIn, function (req, res, next) {
  res.render('save', { csrfToken: req.csrfToken() });
});


router.get('/delete/:_id', isLoggedIn, function (req, res, next) {
  Result.find({ _id: req.params._id },
    function (err, result) {
      if (err) {
        return errHandler(err);
      }
      res.render('delete', { result: result });
    });
});

router.get('/delete_confirmed/:_id', isLoggedIn, function (req, res, next) {
  Result.findOneAndRemove({ _id: req.params._id },
    function (err, result) {
      if (err) {
        return errHandler(err);
      }

    });
  req.flash('error', 'Deleted Succefully');
  res.redirect(307, '/dashboard');

});



router.get('/dashboard', isLoggedIn, function (req, res, next) {
  let successMsg = req.flash('success')[0];
  let messages = req.flash('error');

  Result.find({ user: req.user }, function (err, results) {
    if (err) {
      res.write('Error!');
    }
    let arrayOfGp = [];

    results.forEach(function (singleResult) {
      arrayOfGp.push(singleResult.gp);
    });

    let gpSum = 0;
    for (let i = 0; i < arrayOfGp.length; i++) {
      gpSum = gpSum + arrayOfGp[i];
    }

    const cgpa = gpSum / arrayOfGp.length;

    let user = req.user;
    res.render('user/dashboard', {csrfToken: req.csrfToken(),
      results: results, user: user, cgpa: cgpa, nocgpa: cgpa == null,
      messages: messages, hasErrors: messages.length > 0,
      successMsg: successMsg, noMessages: !successMsg
    });

  });
});

router.get('/edit', isLoggedIn, function (req, res, next) {
  let messages = req.flash('error');

  let user = req.user;
  res.render('user/edit', { csrfToken: req.csrfToken(), user: user, messages: messages, hasErrors: messages.length > 0, });

});

router.post('/edit', isLoggedIn, function (req, res, next) {

  User.findOne({ email: req.user.email }, function (err, user) {
    // todo: don't forget to handle err
    if (err) {
      req.flash('error', 'No account found');
      return res.redirect('/edit');
    }
    if (!user) {
      req.flash('error', 'No account found');
      return res.redirect('/edit');
    }

    // good idea to trim 
    let name = req.body.name.trim();
    let email = req.body.email.trim();
    let matnumber = req.body.matnumber.trim();
    let school = req.body.school.trim();
    let department = req.body.department.trim();


    // validate 
    if (!email || !name || !matnumber || !school || !department) {
      req.flash('error', 'One or more fields are empty');
      return res.redirect('/edit'); // modified
    }

    user.name = req.body.name;
    user.email = email;
    user.matnumber = req.body.matnumber;
    user.school = req.body.school;
    user.department = req.body.department;
    // don't forget to save!
    user.save(function (err) {

      // todo: don't forget to handle err
      if (err) {
        req.flash('error', 'Sorry error occured');
        return res.redirect('/edit'); // modified
      }
      req.flash('success', 'Profile Updated Successfully');
      res.redirect('/dashboard');
    });
  });

});


router.post('/upload', parser.single("image"), isLoggedIn, function (req, res, next) {

  User.findOne({ email: req.user.email }, function (err, user) {
    // for cloudinary upload
    //console.log(req.file) // to see what is returned to you

    // todo: don't forget to handle err

    if (err) {
      req.flash('error', 'No account found');
      return res.redirect('/edit');
    }


    if (!user) {
      req.flash('error', 'No account found');
      return res.redirect('/edit');
    }
    if (!req.file) {
      req.flash('error', "No Image Selected");
      return res.redirect('/dashboard');
    }

    user.image = req.file.url;

    // don't forget to save!
    user.save(function (err) {

      // todo: don't forget to handle err
      if (err) {
        req.flash('error', 'Sorry error occured');
        return res.redirect('/edit'); // modified
      }
      req.flash('success', 'Image Uploaded Successfully');
      res.redirect('/dashboard');
    });
  });

})






router.get('/view/:_id', isLoggedIn, function (req, res, next) {
  Result.find({ _id: req.params._id },
    function (err, result) {
      if (err) {
        return errHandler(err);
      }
      let resultData;
      let resultKey;
      result.forEach(function (singleResult) {

        resultData = Object.values(singleResult.resultsData);
        resultKey = Object.keys(singleResult.resultsData);
      });
      res.render('user/view', { result: result, resultData: resultData, resultKey: resultKey });
    });
});


router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});


router.get('/signin', isNotLoggedIn, function (req, res, next) {
  let messages = req.flash('error');
  console.log(messages);
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', isNotLoggedIn, passport.authenticate('local.signin', {
  //successRedirect: '/dashboard',
  failureRedirect: '/signin',
  failureFlash: true

}), function (req, res, next) {
  if (req.session.oldUrl) {
    let oldLink = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldLink);
  } else {
    res.redirect('/dashboard');
  }

});

router.get('/signup', isNotLoggedIn, function (req, res, next) {
  let messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
  //successRedirect: '/dashboard',
  failureRedirect: '/signup',
  failureFlash: true

}), function (req, res, next) {
  if (req.session.oldUrl) {
    let oldLink = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldLink);

  } else {
    res.redirect('/dashboard');
  }

});



router.get('/contact', function (req, res, next) {
  res.render('contact');
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/signin');
}

function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}