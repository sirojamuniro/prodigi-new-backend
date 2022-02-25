const Models = require('../../../../models');
const bcrypt = require('bcrypt');
const hashed = require('../../../helpers/hashed');
const {
	generate,
	generateInt
} = require('../../../helpers/api/randomString');
const jwtConvert = require('../../../helpers/jwtConvert');
const emailForgotPassword = require('../../../services/email/userForgotPassword');
const emailRegister = require('../../../services/email/userRegister');
const resendVerification = require('../../../services/email/resendVerification');
const userService = require('../../../services/data/userService');
const User = Models.users;
const path = require('path');
const fs = require('fs');
const {
	isEmpty
} = require('lodash');

class AuthController {
	static async login(req, res) {
		try {

			let status = ['waiting-confirmation', 'active'];

			const condition = {
				email: hashed.encrypt(req.body.email),
				status: status,
				role: 'user'
			};

			let dataUserService = await userService.getUser(condition);

			if (!dataUserService) {
				throw ({
					message: 'User not found'
				 })
				
			} else {

				let isValid = bcrypt.compareSync(req.body.password, dataUserService.password)

				let checkVerify = dataUserService.email_verified_at;

				if (isValid) {

					//check verify is valid
					if (checkVerify != null) {

						let token = jwtConvert.sign({
							role: dataUserService.role,
							email: hashed.encrypt(req.body.email),
							status: dataUserService.status
						});
					
						await Models.users.update({
							token: token,
							token_onesignal: req.body.token_onesignal
						}, {
							where: {
								email: hashed.encrypt(req.body.email)
							},
						});

					

						res.status(200).send({
							message: 'Success',
							token: token
						})
					}
					//if verify null
					res.status(200).send({
						message: 'Success',
						token: null
					})

				} else {
					res.status(400).send({
						status: 'Error',
						errors: [{
							message: "Wrong Password or Email"
						}]
					})
				}
			}
		} catch (error) {
			res.status(400).send({
				status: "Error",
				errors: [{
					message: error.message
				}]
			})
		}
	}

	static async forgotPassword(req, res) {
		try {

			let status = ['waiting-confirmation', 'active'];

			const condition = {
				email: hashed.encrypt(req.body.email),
				status: status,
				role: 'user'
			};

			const salt = bcrypt.genSaltSync();
			const generate_password = generate(8);
			let hashed_password = bcrypt.hashSync(generate_password, salt);

			let dataUserService = await userService.getUser(condition);

			if (!dataUserService) {
				res.status(400).send({
					status: 'Error',
					errors: [{
						message: 'User not found'
					}]
				})
			} else {
				await Models.users.update({
						password: hashed_password
					}, {
						where: {
							email: hashed.encrypt(req.body.email)
						}
					})
					.then(async (data) => {
						await emailForgotPassword({
							...dataUserService,
							password: generate_password
						});
						res.status(200).send({
							status: 'Success',
							message: 'A new password has been sent to your e-mail address.'
						})
					})
					.catch((err) => {
						res.status(400).send({
							status: "Error",
							errors: [{
								message: err.message
							}]
						})
					})
			}
		} catch (error) {
			res.status(400).send({
				status: "Error",
				errors: [{
					message: err.message
				}]
			})
		}
	}

	static async logout(req, res) {
		try {
			await Models.users
				.findOne({
					where: {
						email: req.user.email,
						role: 'user'
					},
					raw: true
				})
				.then(async (data) => {
					if (!data) {
						res.status(400).send({
							status: 'Error',
							errors: [{
								message: 'User not found'
							}]
						})
					}

					await Models.users.update({
						token: null
					}, {
						where: {
							email: req.user.email
						},
					});

					res.status(200).send({
						status: 'Success',
						errors: [{
							message: 'You have been logged out'
						}]
					})
				})
		} catch (err) {
			res.status(400).send({
				status: "Error",
				errors: [{
					message: err.message
				}]
			})
		}
	}

	static async register(req, res) {
		const status = 'waiting-confirmation';
		const role = 'user';

		const verification_code = generateInt(6)
		const salt = bcrypt.genSaltSync();
		const password = bcrypt.hashSync(req.body.password, salt);

		let create = {
			name: hashed.encrypt(req.body.name),
			title: req.body.title,
			dob: req.body.dob,
			email: hashed.encrypt(req.body.email),
			phone: hashed.encrypt(req.body.phone),
			password: password,
			token: null,
			token_onesignal: req.body.token_onesignal,
			verification_code: verification_code,
			role: role,
			status: status,
			email_verified_at: new Date(),
		}

		await Models.users.create(create)
			.then(async (result) => {
				await emailRegister({
					...create
				});
				res.status(200).send({
					status: "Success",
					message: 'Please check your email, to finish signing up for Prodigi'
				});
			}).catch((err) => {
				res.status(400).send({
					status: "Error",
					errors: [{
						message: err.message
					}]
				})
			});
	}

	static async registerPhoto(req, res) {
		try {
			let user = await User.findOne({
				where: {
					email: hashed.encrypt(req.body.email)
				}
			})

			if (!user) {
				res.status(400).send({
					status: 'Error',
					errors: [{
						message: 'data is not found'
					}]
				})
			} else {
				if (user.idnumber === null) {
					await User.update({
						idnumber: req.file.filename
					}, {
						where: {
							email: user.email
						}
					})
					res.status(200).send({
						status: 'Succes',
						message: 'Succes upload photo ktp'
					})
				} else if (user.idnumber != null) {

					fs.unlinkSync(path.join(__dirname, process.env.PATH_USER_KTP + '/' + user.idnumber))

					await User.update({
						idnumber: req.file.filename
					}, {
						where: {
							email: user.email
						}
					})

					res.status(200).send({
						status: 'Success',
						message: 'Succes change upload photo ktp'
					})
				}
			}
		} catch (err) {
			res.status(400).send({
				status: "Error",
				errors: [{
					message: err.message
				}]
			})
		}

	}

	static async verifyEmail(req, res) {

		let status_user = ['waiting-confirmation', 'active'];
		let status = 'active';

		try {

			let check = await User.findOne({
					where: {
						email: hashed.encrypt(req.body.email),
						verification_code: req.body.verification_code,
						status: status_user
					},
					raw: true
				}).then(async (data) => {
				
					if (!data) {
						res.status(400).send({
							status: 'Error',
							errors: [{
								message: 'Wrong Resend Verify'
							}]
						})
					}

					let token = jwtConvert.sign({
						role: data.role,
						email: data.email,
						status: data.status
					})

					await Models.users.update({
						status: status,
						token: token,
						token_onesignal: req.body.token_onesignal,
						email_verified_at:new Date(),
						verification_code: null

					}, {
						where: {
							email: data.email
						},
					});

					res.status(200).send({
						status: 'Success',
						token: token
					})
				})
				.catch((err) => {
					res.status(400).send({
						status: "Error",
						errors: [{
							message: err.message
						}]
					})
				})
		} catch (err) {
			res.status(400).send({
				status: "Error",
				errors: [{
					message: err.message
				}]
			})
		}

	}

	static async resendVerify(req, res) {

		const status = 'waiting-confirmation';

		const verification_code = generateInt(6)

		await Models.users
			.findOne({
				where: {
					email: hashed.encrypt(req.body.email),
					status: status
				},
				raw: true
			})
			.then(async (data) => {

				if (!data) {
					res.status(400).send({
						status: 'Error',
						errors: [{
							message: 'User not found'
						}]
					})
				}

				try {
					let create = {
						verification_code: verification_code,
						name: data.name,
						email: data.email
					}
					await Models.users.update({
							status: status,
							verification_code: create.verification_code

						}, {
							where: {
								email: data.email
							},
						})
						.then(async (result) => {
							await resendVerification({
								...create
							});
							res.status(200).send({
								status: "Success",
								message: 'Please check your email, to check resend code'
							})
						}).catch((err) => {
							res.status(400).send({
								status: "Error",
								errors: [{
									message: err.message
								}]
							})
						});

				} catch (err) {
					res.status(400).send({
						status: "Error",
						errors: [{
							message: err.message
						}]
					})
				}

			})

	}

}

module.exports = AuthController