const Models = require('../../../../models');
const bcrypt = require('bcrypt');
const hashed = require('../../../helpers/hashed');
const userService = require('../../../services/data/userService');
const userAddressService = require('../../../services/data/userAddressService');
const User = Models.users;
const UserAddress = Models.user_addresses;

class AddressController {
	static async get(req, res) {
		try {
			const condition = {
				email: req.user.email,
				role: 'user'
			};

			let dataUserService = await userService.getUser(condition);

			if(!dataUserService){
				res.status(400).send({ status: 'Error',errors: [{message:'data not found'}]})
			}
			else{
				let dataUserAddressService = await UserAddress.findAndCountAll({where:{email:req.user.email,role:'user',user_id:dataUserService.id}}).then( data => {
				
					const resObj = data.rows.map( data => {						
	
						return  Object.assign(
							{},
							{	
								id:data.id,
								user_id:data.user_id,
								name:data.name,
								phone:data.phone,
								role:data.role,
								label:data.label,
								address:data.address,
								province:data.province,
								city:data.city,
								sub_district:data.sub_district,
								urban_village:data.urban_village,
								postal_code:data.postal_code,
								map:JSON.parse(data.map),
								status:data.status,
		
							}
						)
					})
					// console.log('ini resobj', resObj)
					res.status(200).send({
						message: 'Success',
						data:{
							count:data.count,
							rows:resObj
						},
						
					});
				})
				
			}
		}
		catch (error) {
			res.status(400).send({ status: "Error",errors: [{message:error.message}] })
		}
	}

	static async create(req, res) {
		try {
			let status = req.body.status;

			
			let status_user = ['waiting-confirmation', 'active'];

			let role = 'user'

			const condition = {
				email: req.user.email,
				role: 'user'
			};

			let dataUserService = await userService.getUser(condition);

			if(!dataUserService){
				res.status(400).send({ status: 'Error', errors: [{message:'data not found'}] })
			}
			else{

				let userCheck = await User.findOne({where:{email:req.user.email, status:status_user}});
					if(!userCheck) {
						res.status(400).send({ status: 'Error',errors: [{message: 'User not active'}]})
					}
					if(status === 'main'){
						await userAddressService.changeAddressNotMain(userCheck.id,userCheck.email,role);
					}
					if(status != 'main'){
						status = null;
					}
					

				let create = {
					user_id:userCheck.id,
					name:req.body.name,
					phone:req.body.phone,
					label:req.body.address,
					address:req.body.complete_address,
					province:req.body.province,
					city:req.body.city,
					sub_district:req.body.sub_district,
					urban_village:req.body.urban_village,
					postal_code:req.body.postal_code,
					map:JSON.stringify(req.body.map),
					email:userCheck.email,
					role:userCheck.role,
					status:status
				}

				await Models.user_addresses.create(create)
				.then((result) => {
					res.status(200).send({ status: "Success", message: 'New Address created successfully' })
				}).catch((err) => {
					res.status(400).send({ status: "Error", errors: [{message:err.message}] })
				});

					
				}
		}
		catch (error) {
			res.status(400).send({ status: "Error", errors: [{message: error.message}] })
		}
	}

	static async update(req, res) {
		const id = req.params.id;

		let status = req.body.status;
		
		let status_user = ['waiting-confirmation', 'active'];

		try {
			const condition = {
				email: req.user.email,
				role: 'user',
				status:status_user
			};
			let address= await  UserAddress.findOne({where: {id:id, email:req.user.email,role:'user'}})

			if (!address){
				res.status(400).send({ status: 'Error', errors: [{message:'data address not found'}] })
			}

			let dataUserService = await userService.getUser(condition);

			if(!dataUserService ){
				res.status(400).send({ status: 'Error',errors: [{message:'data not found'}]})
			}		
		
			else{
				req.body.user_id = dataUserService.id;


				let userCheck = await User.findOne({where:{email:req.user.email, status:status_user,role:'user'}});
					if(!userCheck) {
						res.status(400).send({ status: 'Error',errors: [{message:'User not active'}]})
					}
					
				let address= await  UserAddress.findOne({where: {id:id, user_id:userCheck.id, email:req.user.email,role:req.user.role}})

					if (!address){
						res.status(400).send({ status: 'Error', errors: [{message: 'Wrong address user'}]})
					}

					if(status === 'main'){
						await userAddressService.changeAddressNotMain(userCheck.id,userCheck.email,req.user.role);
					}
					if(status != 'main'){
						status = null;
					}
		

				 await Models.user_addresses.update({
					name:req.body.name,
					phone:req.body.phone,
					label:req.body.address,
					address:req.body.complete_address,
					province:req.body.province,
					city:req.body.city,
					sub_district:req.body.sub_district,
					urban_village:req.body.urban_village,
					postal_code:req.body.postal_code,
					map:JSON.stringify(req.body.map),
					status:status
				}, {
					where: { id: id , user_id:userCheck.id, email:userCheck.email,role:req.user.role}
				})
				.then((data) => {
					res.status(200).send({ status: 'Success', message: "Address updated successfully!" })
				})
				.catch((err) => {
					res.status(400).send({ status: "Error", errors: [{message: err.message}] })
				})
			}
		}
		catch (error) {
			res.status(400).send({ status: "Error", errors: [{message: error.message}] })
		}
	}

	static async delete(req, res) {
		const id = req.params.id;
		
		let status_user = ['waiting-confirmation', 'active'];
		try {
			const condition = {
				email: req.user.email,
				role: 'user',
				status:status_user
			};
			
			let address= await  UserAddress.findOne({where: {id:id, email:req.user.email,role:req.user.role}})

			if (!address){
				res.status(400).send({ status: 'Error', errors: [{message: 'data address not found'}]})
			}

			let dataUserService = await userService.getUser(condition);

			if(!dataUserService){
				res.status(401).send({ status: 'Error', errors: [{message: 'User not found'}] })
			}
			else{

				const checkAddress= await UserAddress.findOne({where:{id:id, user_id:dataUserService.id,email:dataUserService.email, status:'main',role:req.user.role}})
				if (checkAddress){
					res.status(400).send({ status: 'Error', errors: [{message:'Main Address can`t be deleted'}]})
				}

				await Models.user_addresses.update({
					deleted: true
				},{
					where: { id: id, user_id:dataUserService.id, email:dataUserService.email, status: null,role:req.user.role }
				})
				.then((data) => {
					if(!data){
						res.status(400).send({ status: 'Error', errors: [{message: 'Main Address can`t be deleted'}] })
					}
					res.status(200).send({ status: 'Success', message: "Address deleted successfully!" })
				})
				.catch((err) => {
					res.status(400).send(err.message)
				})
			}
		}
		catch (error) {
			res.status(400).send({ message: "Error", errors: [{message: error.message }]})
		}
	}
}


module.exports = AddressController