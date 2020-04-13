const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");

//home page route
router.get("/", pagesController.getHomePage);

//contact route
router.get("/contact", pagesController.getContactPage);

//about FAQ route
router.get("/about", pagesController.getAboutPage);



// Secondary School Dashboard route
router.get("/secdashboard", pagesController.getSecDashboardPage);

module.exports = router;
