const router = require('express').Router()

//middleware validate headers content-type
const header = require('../../middlewares/header');
const user = require('../../middlewares/isUser');
const { validate } = require('../../rules/requestValidate');
const ProductController = require('../../controllers/api/product/ProductController');

//controller

//route
//product
router.get('/product', header.json, header.auth,user.checkUser,validate, ProductController.get);
router.get('/product-detail', header.json, header.auth,user.checkUser,validate, ProductController.getDetail);

router.get('/product/:id', header.json, header.auth,user.checkUser, validate,ProductController.getById);
//best seller
router.get('/best-product', header.json, header.auth, user.checkUser,ProductController.bestSellerProduct);

//search
router.post('/product-max-min', header.json, header.auth,user.checkUser,validate, ProductController.searchProductPriceMaxAndMin);


module.exports = router