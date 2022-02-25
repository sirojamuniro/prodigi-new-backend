const Models = require('../../../models');

async function changeAddressNotMain(user,email,role){
	return await Models.user_addresses
		.update({
			status: null
		}, {
			where: {
				status: 'main',
				user_id:user,
				role:role,
				email:email
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

async function changeAddresMerchantsNotMain(user,email,role){
	return await Models.merchant_addresses
		.update({
			status: null
		}, {
			where: {
				status: 'main',
				merchant_id:user,
				role:role,
				email:email
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
    changeAddressNotMain,
	changeAddresMerchantsNotMain
}