const bcrypt = require('bcrypt');
const hashed = require('../../../helpers/hashed');
const jwt = require('jsonwebtoken');
const Models = require('../../../../models');
const User = Models.users;
const path = require('path');
const fs = require('fs');

class ProfileController {
	static async profile(req, res){
		let user = req.user;
		
		try {
			let condition = await User.findOne({
				where: {
					email: user.email,
					role: 'user'
				},
				raw: true
			})		

			if(!condition){
				res.status(400).send({ status: 'Error', errors: [{message: 'User not found' }] })
			}
			else{
				await User.findAll({where:{email:user.email},
					
				}).then((data) =>{
					const resObj = data.map(data => {
						let nik = data.nik ? hashed.decrypt(data.nik) : null
						return Object.assign(
							{},
							{
								id:data.id,
								photo:data.photo,
								title:data.title,
								place_dob:data.place_dob,
								dob:data.dob,
								nik: nik,
								name:hashed.decrypt(data.name),
								email:hashed.decrypt(data.email),
								phone:hashed.decrypt(data.phone),
								status:data.status,
								role:data.role
							}
						)
					})
                    res.status(200).send({
                        message: 'Success',
						data: resObj
                    });
                })
			}
		}
		catch (error) {
			res.status(400).send({  status: "Error", errors: [{message: error.message }] })
		}
	}

	static async update(req, res){
		let {section} = req.query;

		let selectionSection;
		
		try {
			
			let user = req.user;

			let condition = await User.findOne({
				where: {
					email: user.email,
					role: 'user'
				},

				raw: true

			});		

			if(!condition){
				res.status(400).send({ status: 'Error', errors: [{message: 'User not found' }] })			
			}
			else {
			
				switch(section){
					case 'name':
						selectionSection= {
							name: hashed.encrypt(req.body.name)
						}						
						break;
					case 'nik':
						selectionSection= {
							nik: hashed.encrypt(req.body.nik)
						}
						break;	
					case 'dob':
						selectionSection= {
							dob: req.body.dob
						}
						break;
					case 'place_dob':
						selectionSection= {
						place_dob: req.body.place_dob
					}
					break;
					case 'phone':
						selectionSection= {
							phone: hashed.encrypt(req.body.phone)
						}
						break;	
					default:
						break;
					}

					await Models.users.update(selectionSection,	{
						where: { email: user.email }
				})
				.then((data) => {
		
					res.status(200).send({ status: 'Success',message:"Success update profile" })
				})
				.catch((error) => {

					res.status(400).send({ status: "Error", errors: [{message: 'data not found' }]  })
				})
			}
		}
		catch (error) {
			
			res.status(400).send({ status: "Error", errors: [{message: error.message }]})
		}
	}



	static async changePassword(req, res){

		const salt = bcrypt.genSaltSync();

		let new_password = bcrypt.hashSync(req.body.new_password, salt);	

		try {
			await Models.users.update({
				password : new_password
			}, {
				where: { email: req.user.email }
			})
			.then((data) => {
				res.status(200).send({ status: 'Success', message: "Account password has been changed successfully!" })
			})
		}
		catch (error) {
			res.status(400).send({ status: "Error", errors: [{message: error.message }]})
		}
	}


	static async changeUploadPhoto(req, res){
		const user = req.user;
		
		try {
			let condition = await User.findOne({
				where: {
					email: user.email
				},
				raw: true
			})		

			if(!condition){
				res.status(401).send({ status: 'Error', errors: [{message: 'User photo not found' }] })
			}
			else{
					 
				if(condition.photo === null){

					await User.update({

						photo:req.file.filename

					},

					{where:{email:user.email}}

					)
					res.status(200).send({ status: 'Succes', message: 'Succes upload photo Profile' })
				}

				else if(condition.photo != null){

					fs.unlinkSync(path.join(__dirname,process.env.PATH_PROFILE_USER +  '/'  + condition.photo))

					await User.update({

						photo:req.file.filename

					},

						{where:{email:user.email}}

					)

					res.status(200).send({ status: 'Succes', message: 'Success change photo Profile' })
				}
			}
		}
		catch (error) {
			res.status(400).send({  status: "Error", errors: [{message: error.message }] })
		}
	}

	static async deleteUploadPhoto(req, res){
		const user = req.user;

		try {
			let condition = await User.findOne({
				where: {

					email: user.email,

				},

				raw: true

			})		
			
			if(!condition){

				res.status(401).send({ status: 'Error', errors: [{message: 'User photo not found' }] })

			}
			else{

				if(condition.photo === null){
					res.status(401).send({ status: 'Error', errors: [{message: 'User photo not found' }] })
				}
				 fs.unlinkSync(path.join(__dirname,process.env.PATH_PROFILE_USER +  '/'  + condition.photo))
		
				User.update({
					photo:null
				},

					{where:{email:user.email}}

				)
		
				res.status(200).send({ status: 'Succes', message: 'Success delete photo profile' })
			}
		}
		catch (error) {
			res.status(400).send({  status: "Error", errors: [{message: error.message }] })
		}
	}
}


module.exports = ProfileController