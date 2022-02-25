const { validationResult } = require('express-validator')

const validate = (req, res, next) => {
	const errors = validationResult(req)
	if (errors.isEmpty()) {
	  	return next()
	}
	const extractedErrors = []
	errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }))

	return res.status(422).json({
		status: 'Error',
	  	errors: extractedErrors,
	})
}

module.exports = {
	validate
}