const Models = require('../../../models');
const Notification = Models.notification_admin;



class HomeController {
    static async homeView(req, res) {
		try{

		
			res.render('home', {
				title: 'Home',
				
				home_active:'active'
			});
		}catch(error){
		 req.flash('msg_error', error.message || `Eror mendapatkan data`);
		 res.redirect('/admin/index')
		}
      
    }

}


module.exports = HomeController