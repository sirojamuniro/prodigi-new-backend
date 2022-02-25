const express = require('express');
const router = express.Router();

const uploads_product = require('../../middlewares/uploads/product');
const uploads_category = require('../../middlewares/uploads/category');


const { validate } = require('../../rules/requestValidate');

const authAdminController = require('../../controllers/admin/AuthController');
const ValidationMiddleware = require('../../middlewares/admin/auth.validation.middleware');

//validation request body
const validationLogin = require('../../rules/admin/auth/login');
const validationAuth = require('../../rules/admin/auth/auth');



const ManajemenUserController = require('../../controllers/admin/ManajemenUserController');
const ManajemenProductController = require('../../controllers/admin/ManajemenProductController');
const ManajemenRegionController = require('../../controllers/admin/ManajemenRegionController');
const ManajemenAdminController = require('../../controllers/admin/ManajemenAdminController');
const HomeController = require('../../controllers/admin/HomeController');
const ManajementWishlistController = require('../../controllers/admin/ManajementWishlistController');
const ManajemenViewProductController = require('../../controllers/admin/ManajemenViewProductController');


// router.use(ValidationMiddleware.validLogin)
/* GET home page. */
router.get('/login', authAdminController.loginView);
router.post('/login', validationLogin.validate('login'), authAdminController.login);
router.get('/logout', authAdminController.logout);
router.get('/index',ValidationMiddleware.validLogin,HomeController.homeView)
router.get('/forgot-password-admin-view', authAdminController.forgotView)
router.post('/forgot-password-admin', authAdminController.forgotPassword)

//admin
router.get('/listadmin',ValidationMiddleware.validLogin,ManajemenAdminController.listAdminView)
router.get('/add-admin',ValidationMiddleware.validLogin,ManajemenAdminController.addAdminView)
router.get('/listadmin/:id',ValidationMiddleware.validLogin,ManajemenAdminController.getById)
router.post('/update-admin/:id',ValidationMiddleware.validLogin,ManajemenAdminController.update)
router.post('/register-admin',ValidationMiddleware.validLogin, validationAuth.auth('register'),ManajemenAdminController.registerAdmin)
router.get('/change-password-admin-view',ValidationMiddleware.validLogin,ManajemenAdminController.changePasswordView)
router.post('/change-password-admin',ValidationMiddleware.validLogin,ManajemenAdminController.changePassword)
router.get('/profile-admin',ValidationMiddleware.validLogin,ManajemenAdminController.profileView)
router.post('/update-profile-admin/:id',ValidationMiddleware.validLogin,ManajemenAdminController.updateProfile)

//user
router.get('/listuser',ValidationMiddleware.validLogin,ManajemenUserController.listUserView)
router.get('/listuser/:id',ValidationMiddleware.validLogin,ManajemenUserController.listDetailUserView)

//product
router.get('/listproduct',ValidationMiddleware.validLogin,ManajemenProductController.listProductView); //view product
router.get('/add-product',ValidationMiddleware.validLogin,ManajemenProductController.addProductView); //view add
router.post('/input-product',ValidationMiddleware.validLogin,uploads_product.fields([{ name: 'image', maxCount: 1 },{ name: 'image2', maxCount: 1 },{ name: 'image3', maxCount: 1 }]), ManajemenProductController.post);
router.post('/delete-product/:id',ValidationMiddleware.validLogin,ManajemenProductController.delete);
router.get('/listproduct/:id',ValidationMiddleware.validLogin,ManajemenProductController.getById);
router.post('/update-product/:id',ValidationMiddleware.validLogin,uploads_product.single('image'),ManajemenProductController.update);

//region
router.post('/cities-by-province',ValidationMiddleware.validLogin,ManajemenRegionController.cityByProvince);
router.post('/subdistrict-by-city',ValidationMiddleware.validLogin,ManajemenRegionController.subdisctrictByCity);
router.post('/urban-by-subdistrict',ValidationMiddleware.validLogin,ManajemenRegionController.urbanVillageBySubdisctrict);

//wishlist
router.get('/listwishlist',ValidationMiddleware.validLogin,ManajementWishlistController.listView);

//wishlist
router.get('/listviewproduct',ValidationMiddleware.validLogin,ManajemenViewProductController.listView);
module.exports = router;
