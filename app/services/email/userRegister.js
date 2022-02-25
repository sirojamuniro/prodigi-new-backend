const mailing = require('../../helpers/sendMail');
const hashed = require('../../helpers/hashed');

module.exports = async function userRegister(data) {
	const subject = 'Register';

	const html = '<p style="font-size:18px">Hi ' + hashed.decrypt(data.name) + ',</p>' +
	    '<p style="font-size:18px">This is your code : <b>'+ data.verification_code +'</b><br>';

	return await mailing(data, subject, html);
}