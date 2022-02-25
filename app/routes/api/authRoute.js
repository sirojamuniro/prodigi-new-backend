const router = require('express').Router()

//middleware validate headers content-type
const header = require('../../middlewares/header');


//validation request body
const validator = require('../../rules/api/auth');
const { validate } = require('../../rules/requestValidate');
const uploads_ktp = require('../../middlewares/user/uploads/user_ktp');

//controller
const AuthController = require('../../controllers/api/auth/AuthController');

//route
router.post('/login', header.json, validator.auth('login'), validate, AuthController.login);
router.post('/forgot-password', header.json, AuthController.forgotPassword);

router.post('/register', header.json, validator.auth('register'), validate, AuthController.register);
router.put('/register-photo', uploads_ktp.single('idnumber'), validate,  AuthController.registerPhoto);

router.post('/verify', header.json, validate, AuthController.verifyEmail);
router.post('/resend-verify', header.json, validate,  AuthController.resendVerify);


module.exports = router