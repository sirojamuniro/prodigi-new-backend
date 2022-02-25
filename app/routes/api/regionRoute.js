const router = require('express').Router()
const { validate } = require('../../rules/requestValidate');
//middleware validate headers content-type
const header = require('../../middlewares/header');
//controller
const CitiesController = require('../../controllers/api/region/cities');
const ProvinceController = require('../../controllers/api/region/province');
const SubdistrictController = require('../../controllers/api/region/subdistrict');
const UrbanVillageController = require('../../controllers/api/region/urbanVillage');

//route

//cities
router.get('/cities', header.json, header.auth, validate,CitiesController.get);
router.get('/cities/:id', header.json, header.auth,validate, CitiesController.getCitiesByProvince);

//province
router.get('/province', header.json, header.auth, validate,ProvinceController.get);

//subdistrict
router.get('/subdistrict', header.json, header.auth, validate,SubdistrictController.get);
router.get('/subdistrict/:id', header.json, header.auth,validate, SubdistrictController.getSubdistrictByCities);

//urban village
router.get('/urbanvillage', header.json, header.auth, validate,UrbanVillageController.get);
router.get('/urbanvillage/:id', header.json, header.auth,validate, UrbanVillageController.getUrbanVillageBySubdistrict);

module.exports = router