let express = require('express');
let router = express.Router();
let Result = require('../models/result');


const userController = require('../controller/user');

router.get('/', userController.getDashboard );

router.post('/app',userController.getDataAndSaveToSession);

router.post('/save',userController.saveResult );


router.get('/show',userController.getShow);

router.get('/about', userController.userAbout);


module.exports = router;

