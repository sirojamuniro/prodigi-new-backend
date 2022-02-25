const Models = require('../../../../models');
const Cities = Models.cities;
const Province = Models.provinces;


class CitiesController {
	static async get(req,res) {
		const {start, limit} = req.query;
		try {
			
              await  Cities.findAndCountAll({
			
				attributes: ['id','province_id', 'name'],
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

    static async getCitiesByProvince(req,res) {
		const {start, limit} = req.query;

        const id= req.params.id;
        
		try {
			
              await  Cities.findAndCountAll({where:{province_id:id},
			
                attributes: ['id', 'name'],
				order:[['id','ASC']],
				limit: limit ? Number(limit) : null,
				offset: start ? Number(start) : null
					
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

module.exports = CitiesController