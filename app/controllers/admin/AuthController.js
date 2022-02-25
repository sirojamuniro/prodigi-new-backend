const { validationResult } = require('express-validator');
const Models = require('../../../models');
const bcrypt = require('bcrypt');
const hashed = require('../../helpers/hashed');
const emailForgotPassword = require('../../services/email/userForgotPassword');
const Admin = Models.admin;
const {
	generate,
	generateInt
} = require('../../helpers/api/randomString');

class AuthController {
    static loginView(req, res) {
        res.render('auth/login', {
            title: 'Login',
            layout: false
        });
    }

    static login(req, res) {
		const errors = validationResult(req);
 
		if (!errors.isEmpty()) {
            req.flash('msg_error', `Email or Username not found`);
			res.redirect('/admin/login');
		}
        
        let admin = Admin.findOne({
                where: {
					email: hashed.encrypt(req.body.email)
                },
            })
            .then((data_user) => {
              
                if(!data_user) {
                    req.flash('msg_error', "Email or Username not found");
                    res.redirect('/admin/login');
                } else {
                 
                    let user_id = data_user.id;
                    let email = data_user.email;
                    let name = hashed.decrypt(data_user.name);
                    
					if(email){
						let isValid = bcrypt.compareSync(req.body.password, data_user.password)
                      
						if(isValid) {
							req.session.loggedin = true
							req.session.name = name;
							req.session.user_id = user_id;
                            req.session.email = email;
						
							res.redirect('/admin/index');
						} else {
							req.flash('msg_error', `Wrong password or Email`);
							res.redirect('/admin/logout');
						}
					}
					else{
						req.flash('msg_error', `Unauthorized`);
						res.redirect('/admin/logout');
					}
                }
            })
            .catch((err) => {
             
                req.flash('msg_error', err.message || "Some error occurred while login.");
                res.redirect('/admin/logout');
            })
    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect('/admin/login');
    }

    static forgotView(req, res) {
		res.render('auth/forgot_password', {
            title: 'Forgot Password',
			layout:false
            // home_active:'active'
        });
    }

    static async forgotPassword(req, res){
		try {			
			const salt = bcrypt.genSaltSync();
			const generate_password = generate(8);
			let  hashed_password = bcrypt.hashSync(generate_password, salt);

			let dataUserService = await Admin.findOne({
                where:{	email: hashed.encrypt(req.body.email)},	raw: true
            });
			// console.log('ini data userservice',dataUserService)

			if(!dataUserService){
                throw ({
                    message: 'Admin does not exist'
                 })
			}
			else {
				await Models.admin.update({
					password: hashed_password
				}, {
					where: {
						email: hashed.encrypt(req.body.email)
					}
				})
				.then(async (data) => {
					console.log('ini data',data)

					// console.log('ini datauserservice',dataUserService)
					await emailForgotPassword({ name:dataUserService.name ,email:dataUserService.email, password: generate_password });
					
					req.flash('msg_info', `Password baru sudah dikirim ke alamat emailmu`);
					res.redirect('/admin/forgot-password-admin-view');
				})
			}
		}
		catch (error) {
			req.flash('msg_error', error.message || "Some error occurred while forgot password.");
			res.redirect('/admin/forgot-password-admin-view');
		}
	}
}

module.exports = AuthController
