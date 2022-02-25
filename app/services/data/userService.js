const Models = require('../../../models');
const hashed = require('../../helpers/hashed');

async function getUser(condition, optional){
	if(!optional) {
		return await Models.users
		.findOne({
			where: condition,
			raw: true
		})
		.then((res)=>{
			return res;
		})
		.catch((e)=>{
			return e.message;
		});
	}
	else {
		return await Models.users
		.findOne({
			where: condition,
			include: optional
		})
		.then((res)=>{
			return res.dataValues;
		})
		.catch((e)=>{
			return e.message;
		});
	}
}

async function addressesByUserID(user_id,role,email) {
	return await Models.user_addresses
	.findAll({
        where: {
			user_id: user_id,
			role:role,
			email:email,
			deleted: 0
		},
        raw: true
    })
    .then((res)=>{
        return res;
    })
    .catch((e)=>{
        return e.message;
    });
}

module.exports = {
    getUser,
	addressesByUserID
}