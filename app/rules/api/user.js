const { body } = require('express-validator');
const hashed = require('../../helpers/hashed');
const Models = require('../../../models');
const bcrypt = require('bcrypt');

exports.auth = (method) => {
	switch (method) {
		case 'update-profile': {
			return [
				body('email').notEmpty().withMessage('Email is required'),
				body('email').isEmail().withMessage('Email is not valid'),
				body('email').custom(async (email) => {
					await Models.users
					.findOne({
						where: { email: hashed.encrypt(email), role: 'user' },
						raw: true
					})
					.then(user => {
						if (!user) {
							return Promise.reject('Email not found')
						}
					})
				}),
				body('password').notEmpty().trim().withMessage('Password is required'),
				body('password').isLength({ min: 5 }).trim().withMessage('Password must be at least 5 characters'),
			]
		}
		case 'change-password': {
			return [
				body('old_password').notEmpty().trim().withMessage('Old Password is required'),
				body('old_password').isLength({ min: 5 }).trim().withMessage('Old Password must be at least 5 characters'),
				body('old_password').custom(async (old_password, { req }) => {
					let status = ['waiting-confirmation', 'active']
					await Models.users
						.findOne({
							where: {
								email: req.user.email,
								role: 'user',
								status: status,
							},
							raw: true
						})
						.then(async (data_user) => {
							let isValid = bcrypt.compareSync(old_password, data_user.password)
							if(!isValid) {
								return Promise.reject('Wrong old password')
							}
						})
				}),
				body('new_password').notEmpty().trim().withMessage('New Password is required'),
				body('new_password').isLength({ min: 5 }).trim().withMessage('Password must be at least 5 characters'),
				body('confirm_password').notEmpty().trim().withMessage('Confirm Password is required'),
				body('confirm_password').trim().custom(async (confirm_password, { req }) => {
					const password = req.body.new_password;
					if(password !== confirm_password){
						throw new Error('Confirmation Password not same with new password')
					}
				})
			]
		}
	}
}