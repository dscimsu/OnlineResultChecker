const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// check results route
router.get("/checkresults", studentController.getCheckResultPage);
router.get("/dashboard", studentController.getDashboardPage);

module.exports = router;
