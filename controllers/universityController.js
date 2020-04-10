let express = require('express');
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




//getting calculator page
exports.getCalculatorPage = (req, res, next) => {
    res.render('app', { csrfToken: req.csrfToken() });
}


//getting save page form
exports.getSavePage = (req, res, next) => {
    res.render('save', { csrfToken: req.csrfToken() });
}

// for saving calculated results to session
exports.saveResultsToSession = (req, res, next) => {
    let objectData = req.body;
    delete objectData._csrf;
    req.session.resultData = objectData;
    req.session.gp = req.body.gp;
    res.redirect("save");
}

//saving the result to database
exports.saveResultsToDatabase = (req, res, next) => {
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
}

//getting the delete form with user data to be deleted
exports.getDeleteForm = (req, res, next) => {
    Result.find({ _id: req.params._id },
        function (err, result) {
            if (err) {
                return errHandler(err);
            }
            res.render('delete', { result: result });
        });
}

// deleting user result from database
exports.deleteResult = (req, res, next) => {
    Result.findOneAndRemove({ _id: req.params._id },
        function (err, result) {
            if (err) {
                return errHandler(err);
            }

        });
    req.flash('error', 'Deleted Succefully');
    res.redirect(307, '/dashboard');

}

// getting dashboard with all required user data
exports.getDashboard = (req, res, next) => {
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

        res.render('user/dashboard', {
            csrfToken: req.csrfToken(),
            results: results, user: user, cgpa: cgpa, nocgpa: cgpa == null,
            messages: messages, hasErrors: messages.length > 0,
            successMsg: successMsg, noMessages: !successMsg
        });

    });
}

//getting edit page with user details to be edited
exports.getEditPage = (req, res, next) => {
    let messages = req.flash('error');

    let user = req.user;
    res.render('user/edit', { csrfToken: req.csrfToken(), user: user, messages: messages, hasErrors: messages.length > 0, });

}


// editing the user details
exports.editUser = (req, res, next) => {

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

}

exports.uploadProfileImage = (req, res, next) => {

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

}

// for viewing individual user result
exports.viewIndividualResult = (req, res, next) => {
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
}

//for loging the user out
exports.logoutUser = (req, res, next) => {
    req.logout();
    res.redirect('/');
}

// for getting the sign up page
exports.getSignInPage = (req, res, next) => {
    let messages = req.flash('error');
    console.log(messages);
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
}

// redirects the user to the last visited page before login or signup
exports.normalRedirect = (req, res, next) => {
    if (req.session.oldUrl) {
        let oldLink = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldLink);
    } else {
        res.redirect('/dashboard');
    }

}


exports.getSignUpPage = (req, res, next) => {
    let messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
}

//function to check if the user is logged in
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/signin');
}



//function to check it the user is not logged in
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


exports.imageParser = ()=>{

    return parser.single("image")
}