const Models = require('../../../models');
const Province = Models.provinces;
const City = Models.cities;
const Subdistrict = Models.subdistricts;
const UrbanVillage = Models.urban_villages;



class ManajemenRegionController {
	static async cityByProvince(req, res) {
        const province_id = req.body.province_id;
        try{
        let city = await City.findAll({ 
			where: { province_id:province_id, deleted: 0} });

        res.status(200).json({city});  
        }
        catch (error) {
        req.flash('msg_error', error.message || `Eror mendapatkan cities`);
        res.redirect('/admin/index')}
        
        
    }

    static async subdisctrictByCity(req, res) {
        const city_id = req.body.city_id;
        try{
        let subdistrict= await Subdistrict.findAll({ 
			where: { city_id:city_id, deleted: 0} });

            res.status(200).json({subdistrict});  
        }
        catch (error) {
        req.flash('msg_error', error.message || `Eror mendapatkan subdistrict`);
        res.redirect('/admin/index')}
        
    }

    static async urbanVillageBySubdisctrict(req, res) {
        const subdistrict = req.body.subdistrict_id;
        try{
        let urban= await UrbanVillage.findAll({ 
			where: { subdistrict_id:subdistrict, deleted: 0} });

            res.status(200).json({urban});  
        }
        catch (error) {
        req.flash('msg_error', error.message || `Eror mendapatkan subdistrict`);
        res.redirect('/admin/index')}
        
    }
	
}

module.exports = ManajemenRegionController