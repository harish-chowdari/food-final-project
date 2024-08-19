const { senEmail } = require('../controller/NodeMailerController');

const router = require('express').Router();


router.post('/send-email', senEmail);




module.exports = router;  