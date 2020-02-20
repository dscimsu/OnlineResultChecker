let express = require('express');
let router = express.Router();
let csrf = require('csurf');
const passport = require('passport');
let Result = require('../models/result');
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const userController = require('../controller/user');


const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "Profile",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({ storage: storage });

let csrfProtection = csrf();
router.use(csrfProtection);

router.get('/app', userController.getCsrfTokenApp);

router.get('/save',userController.getCsrfTokenSave );


router.get('/delete/:_id', userController.findErrorResult)

router.get('/delete_confirmed/:_id',userController.findAndRemoveErrorResult);



router.get('/dashboard', userController.getUserDetails);

router.get('/edit', userController.getUserMessage);

router.post('/edit', userController.authenticateUserDetail);


router.post('/upload', parser.single("image"),userController.getUserImage );

router.get('/view/:_id',userController.getUserResult );


router.get('/logout',userController.userLogout);


router.get('/signin',isNotLoggedIn,userController.userNotLoggedIn);

router.post('/signin', isNotLoggedIn, passport.authenticate('local.signin', {
  //successRedirect: '/dashboard',
  failureRedirect: '/signin',
  failureFlash: true

}), userController.redirectSignin);

router.get('/signup', isNotLoggedIn, userController.userMsg);

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
  //successRedirect: '/dashboard',
  failureRedirect: '/signup',
  failureFlash: true

}), userController.redirectSignup);



router.get('/contact',userController.gectContacts );


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