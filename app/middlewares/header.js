require('dotenv').config();
const jwt = require('../helpers/jwtConvert');

exports.json = (req, res, next) => {
    if (req.headers['content-type'] != 'application/json') {
		return res.status(404).send({
			status:'Error', errors:[{
            message: "Headers must be set to application/json"}]
        });
    } else {
		next();
    }
};

exports.auth = (req, res, next) => {
	try {
		if(!req.headers.authorization){
			return res.status(401).send({ status:'Error', errors:[{message: 'No token provided'}]});
		}

		const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
		if (!token) {
			return res.status(401).send({ status:'Error', errors:[{message: 'Authentication failed'}]});
		}

		const verified = jwt.verify(token, process.env.JWT_SECRET);
		if(!verified){
			return res.status(401).send({ message: 'Authentication failed'});
		}

		req.token = token;
		req.user = verified;
		next();
	}
	catch (err) {
		return res.status(401).send({status:'Error', errors:[{ message: 'Invalid token'}]});
	}
};