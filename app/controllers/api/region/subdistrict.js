const Models = require('../../../../models');
const Subdistrict = Models.subdistricts;
const Cities = Models.cities;


class SubdistrictController {
	static async get(req,res) {
		const {start, limit} = req.query;
		try {
			
              await  Subdistrict.findAndCountAll({
			
				attributes: ['id','city_id', 'name'],
				order:[['id','ASC']],
				limit: limit ? Number(limit) :null,
				offset: start ? Number(start) :null
					
                }).then((data) => {
                    res.status(200).send({
                        message: 'Success',
						data: data,
						// raw: false
                    });
                })
		}
		catch (error) {
			res.status(400).send({  status: "Error", data: error.message })
		}
	}
	
    static async getSubdistrictByCities(req,res) {

		const {start, limit} = req.query;

        const id = req.params.id;

		try {
			
              await  Subdistrict.findAndCountAll({where:{city_id:id},
                                

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

module.exports = SubdistrictController