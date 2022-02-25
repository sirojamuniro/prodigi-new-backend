const Models = require('../../../../models');
const UrbanVillage = Models.urban_villages;
const Subdistrict = Models.subdistricts;

class UrbanVillageController {
	static async get(req,res) {
		const {start, limit} = req.query;
		try {
			
              await  UrbanVillage.findAndCountAll({
			
				attributes: ['id','subdistrict_id', 'name'],
				order:[['id','ASC']],
				limit: limit ? Number(limit) :null,
				offset: start ? Number(start) :null
					
                }).then((data) => {
                    res.status(200).send({
                        message: 'Success',
						data: data,
						// raw: true
						
                    });
                })
		}
		catch (error) {

			res.status(400).send({  status: "Error", data: error.message })
		}
	}

    static async getUrbanVillageBySubdistrict(req,res) {

		const {start, limit} = req.query;

        const id = req.params.id;

		try {
			
              await  UrbanVillage.findAndCountAll({
                  where:{subdistrict_id:id},
                

				attributes: ['id','name'],
				order:[['id','ASC']],
				limit: limit ? Number(limit) :null,
				offset: start ? Number(start) :null
					
                }).then((data) => {
                    res.status(200).send({
                        message: 'Success',
						data: data
                    });
                })
		}
		catch (error) {
	
			res.status(400).send({  status: "Error", data: error.message })
		}
	}

	
}

module.exports = UrbanVillageController