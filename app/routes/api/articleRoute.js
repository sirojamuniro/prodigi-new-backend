const router = require('express').Router()
const uploads = require('../../middlewares/uploads/article');

// const BannerController = require('../../controllers/api/banner/BannerController');
//middleware validate headers content-type
const header = require('../../middlewares/header');
const user = require('../../middlewares/isUser');
const { validate } = require('../../rules/requestValidate');
const ArticleController = require('../../controllers/api/article/ArticleController');

//validation request body
// const validator = require('../../rules/api/user');
// const validatorAddress = require('../../rules/api/address');
// const { validate } = require('../../rules/requestValidate');

//controller

//route
router.get('/article', header.json, header.auth,user.checkUser, validate, ArticleController.get);
router.get('/article/:id', header.json, header.auth,user.checkUser, validate, ArticleController.getById);
router.get('/article-detail', header.json, header.auth,user.checkUser, validate, ArticleController.getAll);
router.put('/change-article/:id',uploads.single('image'), ArticleController.update);
router.delete('/delete-article/:id', ArticleController.delete);
router.post('/input-article', uploads.single('image'), ArticleController.post);


module.exports = router