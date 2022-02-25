const { body } = require('express-validator');
const hashed = require('../../helpers/hashed');
const Models = require('../../../models');

exports.auth = (method) => {
	switch (method) {
		case 'login': {
			return [
				body('email').notEmpty().withMessage('Email is required'),
				body('email').isEmail().withMessage('Email is not valid'),
				body('email').custom(async (email) =>{
					let status = ['waiting-confirmation', 'active']
					await Models.users
					.findOne({
						where: {
							email: hashed.encrypt(email),
							status: status,
							role: 'user'
						},
						raw: true
					})
					.then(user => {
						if (!user) {
							return Promise.reject('Email or Password not found')
						}
					})
				}),
				body('password').notEmpty().trim().withMessage('Password is required'),
				body('password').isLength({ min: 5 }).trim().withMessage('Password must be at least 5 characters'),
			]
		}
		case 'register': {
			return [
				body('name').notEmpty().withMessage('Name is required'),
				body('name').isString().withMessage('Name is not valid'),
				body('title').notEmpty().withMessage('Title is required'),
				body('title').isIn(['mr', 'mrs']).withMessage('Title is not valid'),
				body('dob').notEmpty().withMessage('Date of Birth is required'),
				body('dob').isDate().withMessage('Date of Birth not valid'),
				body('email').notEmpty().withMessage('Email is required'),
				body('email').isEmail().withMessage('Email is not valid'),
				body('email').custom(async (email) =>{
					await Models.users
					.findOne({
						where: { email: hashed.encrypt(email), role: 'user' },
						raw: true
					})
					.then(user => {
						if (user) {
							return Promise.reject('Email address already taken')
						}
					})
				}),
				body('phone').notEmpty().withMessage('Phone number is required'),
				body('phone').isLength({ min: 10 }).withMessage('Phone number must be at least 13 characters'),
				body('phone').isLength({ max: 14 }).withMessage('Phone number must be at least 15 characters'),
				body('phone').isMobilePhone('id-ID').withMessage('Phone number is not valid'),
				body('password').notEmpty().trim().withMessage('Password is required'),
				body('password').isLength({ min: 5 }).trim().withMessage('Password must be at least 5 characters'),
				body('confirm_password').notEmpty().trim().withMessage('Password is required'),
				body('confirm_password').trim().custom(async (confirm_password, { req }) => {
					const password = req.body.password;
					if(password !== confirm_password){
						throw new Error('Confirmation password not same with password')
					}
				}),
			]
		}
		case 'forgot-password': {
			return [
				body('email').notEmpty().withMessage('Email is required'),
				body('email').isEmail().withMessage('Email is not valid'),
				body('email').custom(async (email) =>{
					let status = ['waiting-confirmation', 'active']
					await Models.users
					.findOne({
						where: {
							email: hashed.encrypt(email),
							status: status,
							role: 'user'
						},
						raw: true
					})
					.then(user => {
						if (!user) {
							return Promise.reject('Email address not found')
						}
					})
				})
			]
		}
	}
}