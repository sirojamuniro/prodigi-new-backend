const { body } = require('express-validator');
const hashed = require('../../helpers/hashed');

exports.address = (method) => {
	switch (method) {
		case 'create': {
			return [
				body('address').notEmpty().withMessage('Address Name is required'),
				body('complete_address').notEmpty().withMessage('Address is required'),
				body('province').notEmpty().withMessage('Province is required'),
				body('city').notEmpty().withMessage('City is required'),
				body('sub_district').notEmpty().withMessage('Sub-District is required'),
				body('urban_village').notEmpty().withMessage('Urban Village is required'),
				body('postal_code').notEmpty().withMessage('Postal Code is required'),
				body('postal_code').isLength({ min: 5, max: 5 }).trim().withMessage('Postal Code must be at least 5 characters'),
				body('status').optional({ nullable: true }),
			]
		}
		case 'update': {
			return [
				body('address').notEmpty().withMessage('Address Name is required'),
				body('complete_address').notEmpty().withMessage('Address is required'),
				body('province').notEmpty().withMessage('Province is required'),
				body('city').notEmpty().withMessage('City is required'),
				body('sub_district').notEmpty().withMessage('Sub-District is required'),
				body('urban_village').notEmpty().withMessage('Urban Village is required'),
				body('postal_code').notEmpty().withMessage('Postal Code is required'),
				body('postal_code').isLength({ min: 5, max: 5 }).trim().withMessage('Postal Code must be at least 5 characters'),
				body('status').optional({ nullable: true }),
			]
		}
	}
}