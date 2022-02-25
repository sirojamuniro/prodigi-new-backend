const mailing = require('../../helpers/sendMail');
const hashed = require('../../helpers/hashed');

module.exports = async function forgotPassword(data) {

	const subject = 'Forgot Password';

	const html = '<p style="font-size:18px">Hi ' + hashed.decrypt(data.name) + ',</p>' +
	    '<p style="font-size:18px">This is your new password : <b>'+ data.password +'</b><br>';

	return await mailing(data, subject, html);
}