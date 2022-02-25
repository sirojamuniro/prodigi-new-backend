const { body } = require('express-validator');

exports.product = (method) => {
	switch (method) {
		case 'category': {
			return [
				body('name').notEmpty().withMessage('Name is required'),
				body('detail_name').notEmpty().withMessage('Detail Name is required'),
			]
		}
		// case 'discount': {
		// 	return [
		// 		body('price').notEmpty().withMessage('Price is required'),
		// 		body('price').isFloat().withMessage('Discount only allowed float'),
		// 	]
		// }
        // case 'pressure': {
		// 	return [
		// 		body('name').notEmpty().withMessage('Name is required'),
		// 	]
		// }
        case 'product': {
			return [
				body('name').notEmpty().withMessage('Name is required'),
                body('price').notEmpty().withMessage('Price is required'),
                body('price').isInt().withMessage('Price allowed only integer'),
                body('pressure_in').notEmpty().withMessage('Pressure In is required'),
                body('pressure_out').notEmpty().withMessage('Pressure Out is required'),
                body('capacity_flow_gas').notEmpty().withMessage('Capacity Flow Gas is required'),
                body('quantity').notEmpty().withMessage('Quanriry is require'),
                body('quantity').isInt().withMessage('Quantity allowed only integer'),
			]
		}
	}
}