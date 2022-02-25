const { body } = require('express-validator')

exports.validate = (method) => {
  switch (method) {
    case 'login': {
     return [
        body('email', 'Invalid email').exists().isEmail().notEmpty().bail(),
        body('password').exists().notEmpty().isLength({ min: 3 }).bail()
       ]
    }
  }
}