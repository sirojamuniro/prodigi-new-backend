const Models = require('../../../../models');
const Province = Models.provinces


class ProvinceController {
	static async get(req,res) {
		const {start, limit} = req.query;
		try {
			
              await  Province.findAndCountAll({
			
				attributes: ['id', 'name'],
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

module.exports = ProvinceController