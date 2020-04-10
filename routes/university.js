const express = require('express');
let router = express.Router();
let csrf = require('csurf');
const universityController = require('../controllers/universityController');
const passport = require('passport');
let csrfProtection = csrf();
router.use(csrfProtection);



//route for the gp calcultor form
router.get('/app', universityController.getCalculatorPage);


//route for the result save form
router.get('/save', universityController.isLoggedIn, universityController.getSavePage );


// post route for saving calculated results to session
router.post("/app", universityController.saveResultsToSession);


//post route for saving results to database
router.post("/save", universityController.isLoggedIn, universityController.saveResultsToDatabase);



//route for getting the delete form with user data to be deleted
router.get('/delete/:_id', universityController.isLoggedIn, universityController.getDeleteForm);

//route for deleting user results
router.get('/delete_confirmed/:_id', universityController.isLoggedIn, universityController.deleteResult);


// route for getting the dashboard with all required user data
router.get('/dashboard', universityController.isLoggedIn, universityController.getDashboard );


//route for getting the edit form with user data to be edited
router.get('/edit', universityController.isLoggedIn, universityController.getEditPage);


//route for editing user data
router.post('/edit', universityController.isLoggedIn, universityController.editUser);

//route for uploading profile image 
router.post('/upload', universityController.imageParser, universityController.isLoggedIn, universityController.uploadProfileImage );



//route for viewing individual user result
router.get('/view/:_id', universityController.isLoggedIn, universityController.viewIndividualResult);

//route for  logging the user out
router.get('/logout', universityController.isLoggedIn, universityController.logoutUser);


// route for getting the sigin page
router.get('/signin', universityController.isNotLoggedIn, universityController.getSignInPage);

// route for signin the user in using passport
router.post('/signin', universityController.isNotLoggedIn, passport.authenticate('local.signin', {
  //successRedirect: '/dashboard',
  failureRedirect: '/signin',
  failureFlash: true

}), 
// redirects the user to the last visited page before login.
universityController.normalRedirect
);


// route for registering getting the signup page
router.get('/signup', universityController.isNotLoggedIn, universityController.getSignUpPage);


//route for user signup using passport
router.post('/signup', universityController.isNotLoggedIn, passport.authenticate('local.signup', {
  //successRedirect: '/dashboard',
  failureRedirect: '/signup',
  failureFlash: true

}), 
// redirects the user to the last visited page before login.
universityController.normalRedirect);

// exporting this module
module.exports = router;


