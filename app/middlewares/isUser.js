require('dotenv').config();
const Models = require('../../models');
const User = Models.users;
exports.checkUser = async (req, res, next) => {
    try {
        let role = req.user.role;
        let user = await User.findOne({where:{email:req.user.email}});
        
        if(role != 'user' || !user){
           
            return res.status(401).send({ status:'Error', errors:[{message: 'This not your permission'}]});
        }
        else{
          
            next();
        }
    }
    catch (err) {
        		return res.status(401).send({status:'Error', errors:[{ message: 'Invalid '}]});
        	}
};

// exports.auth = (req, res, next) => {
// 	try {
// 		if(!req.headers.authorization){
// 			return res.status(401).send({ status:'Error', errors:[{message: 'No token provided'}]});
// 		}

// 		const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
// 		if (!token) {
// 			return res.status(401).send({ status:'Error', errors:[{message: 'Authentication failed'}]});
// 		}

// 		const verified = jwt.verify(token, process.env.JWT_SECRET);
// 		if(!verified){
// 			return res.status(401).send({ message: 'Authentication failed'});
// 		}

// 		req.token = token;
// 		req.user = verified;
// 		next();
// 	}
// 	catch (err) {
// 		return res.status(401).send({status:'Error', errors:[{ message: 'Invalid token'}]});
// 	}
// };