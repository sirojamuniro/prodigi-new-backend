const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config()
let company = process.env.MG_HOST
let password = process.env.MG_PUBLIC_API_KEY

const hashed = require('../helpers/hashed');

const transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    service: 'Mailgun',
    auth: {
        user: company,
        pass: password
    },

    tls: { rejectUnauthorized: false }
}));

let from = '';

if(process.env.NODE_ENV != 'production'){
	from = 'Prodigi Testing';
} else {
	from = 'Prodigi';
}

module.exports = async function sendMail(data, subject, html) {

	var sending = {
		from: from+'<' + company + '>',
        to: hashed.decrypt(data.email),
		subject: subject,
		html: html
	};

    let info = await transporter.sendMail(sending, function (error, body) {
		if(error){
			return error;
		}
		else{
			return body;
		}
	});

    return info
}