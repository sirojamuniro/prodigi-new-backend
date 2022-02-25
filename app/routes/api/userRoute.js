const router = require('express').Router()

//middleware validate headers content-type
const header = require('../../middlewares/header');

//validation request body
const validator = require('../../rules/api/user');
const validatorAddress = require('../../rules/api/address');
const { validate } = require('../../rules/requestValidate');
const user = require('../../middlewares/isUser');

const uploads_profile = require('../../middlewares/user/uploads/user_profile');

//controller
const AuthController = require('../../controllers/api/auth/AuthController');
const ProfileController = require('../../controllers/api/user/ProfileController');
const AddressController = require('../../controllers/api/user/AddressController');
const WislistController = require('../../controllers/api/user/WishlistController');
const ViewProductController = require('../../controllers/api/user/ViewProductController');

//route
router.get('/profile', header.json, header.auth, validate, ProfileController.profile);
router.put('/update-profile', header.json, header.auth,validate, ProfileController.update);


router.put('/change-upload-photo-profile',  header.auth, uploads_profile.single('photo'), validate,  ProfileController.changeUploadPhoto);
router.delete('/delete-upload-photo-profile',  header.auth, user.checkUser, validate,  ProfileController.deleteUploadPhoto);

router.get('/addresses', header.json, header.auth,  user.checkUser,validate, AddressController.get);
router.post('/addresses-input', header.json, header.auth, user.checkUser, validatorAddress.address('create'), validate, AddressController.create);
router.put('/addresses/:id', header.json, header.auth,  user.checkUser,validatorAddress.address('update'), AddressController.update);
router.delete('/addresses-delete/:id', header.json, header.auth, user.checkUser,validate,  AddressController.delete);

router.post('/change-password', header.json, header.auth, validator.auth('change-password'), validate, ProfileController.changePassword);
router.get('/logout', header.json, header.auth, AuthController.logout);

router.post('/wishlist-input', header.json, header.auth, user.checkUser, validate, WislistController.post);
router.get('/wishlist', header.json, header.auth, user.checkUser, validate, WislistController.getMyWishlist);
router.delete('/wishlist-delete/:id', header.json, header.auth,  user.checkUser,validate, WislistController.delete);

router.post('/viewproduct', header.json, header.auth, user.checkUser, validate, ViewProductController.post);
router.get('/viewproduct', header.json, header.auth, user.checkUser, validate, ViewProductController.get);
module.exports = router