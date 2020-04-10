let express = require('express');
let router = express.Router();
let csrf = require('csurf');
const passport = require('passport');
let Result = require('../models/result');
let User = require('../models/user');
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

// for cloudinary setup for image upload
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "Profile",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({ storage: storage });

let csrfProtection = csrf();
router.use(csrfProtection);


//route for the gp calculte form
router.get('/app', function (req, res, next) {
  res.render('app', { csrfToken: req.csrfToken() });
});


//route for the result save form
router.get('/save', isLoggedIn, function (req, res, next) {
  res.render('save', { csrfToken: req.csrfToken() });
});


// post route for saving calculated results to session
router.post("/app", function (req, res, next) {
  let objectData = req.body;
  delete objectData._csrf;
  req.session.resultData = objectData;
  req.session.gp = req.body.gp;
  res.redirect("save");
});


//post route for saving results to database
router.post("/save", isLoggedIn, function (req, res, next) {
  let result = new Result({
    user: req.user,
    semester: req.body.semester,
    level: req.body.level,
    year: req.body.year,
    gp: req.session.gp,
    resultsData: req.session.resultData,
  });
  result.save(function (err, result) {
    if (req.session.resultData == null) {
      req.flash("error", "SORRY NO CALCULATION WAS MADE");
    } else {
      req.session.resultData = null;
      req.session.gp = null;
      req.flash("success", "Saved Successfully");
    }

    res.redirect("/dashboard");
  });
});



//route for getting the delete form with user data to be deleted
router.get('/delete/:_id', isLoggedIn, function (req, res, next) {
  Result.find({ _id: req.params._id },
    function (err, result) {
      if (err) {
        return errHandler(err);
      }
      res.render('delete', { result: result });
    });
});

//route for deleting user results
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


// route for getting the dashboard with all required user data
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


//route for getting the edit form with user data to be edited
router.get('/edit', isLoggedIn, function (req, res, next) {
  let messages = req.flash('error');

  let user = req.user;
  res.render('user/edit', { csrfToken: req.csrfToken(), user: user, messages: messages, hasErrors: messages.length > 0, });

});


//route for editing user data
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

//route for uploading profile image 
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



//route for viewing individual user result
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

//route for  loging the user out
router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});


// route for getting the sigin page
router.get('/signin', isNotLoggedIn, function (req, res, next) {
  let messages = req.flash('error');
  console.log(messages);
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

// route for signin the user in using passport
router.post('/signin', isNotLoggedIn, passport.authenticate('local.signin', {
  //successRedirect: '/dashboard',
  failureRedirect: '/signin',
  failureFlash: true

}), 
// redirects the user to the last visited page before login.
function (req, res, next) {
  if (req.session.oldUrl) {
    let oldLink = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldLink);
  } else {
    res.redirect('/dashboard');
  }

      });


// route for registering getting the signup page
router.get('/signup', isNotLoggedIn, function (req, res, next) {
  let messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});


//route for user signup using passport
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
  //successRedirect: '/dashboard',
  failureRedirect: '/signup',
  failureFlash: true

}), 
// redirects the user to the last visited page before login.
function (req, res, next) {
  if (req.session.oldUrl) {
    let oldLink = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldLink);

  } else {
    res.redirect('/dashboard');
  }

});

// exporting this module
module.exports = router;

//function to check if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/signin');
}
//function to check it the user is not logged in
function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}