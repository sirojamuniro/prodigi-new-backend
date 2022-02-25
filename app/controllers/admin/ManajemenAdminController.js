const Models = require('../../../models');
const Province = Models.provinces;
const Admin = Models.admin;
const Subdistrict = Models.subdistricts;
const Management = Models.managements;
const bcrypt = require('bcrypt');
const Role = Models.roles;
const hashed = require('../../helpers/hashed');

class ManajemenAdminController {

    static async addAdminView(req, res) {
        let listRoles = [];
        let listManagements = [];

        let listRole = await  Role.findAll({
            attributes: ['id', 'name'],            
        });
        let listManagement = await Management.findAll({
            attributes: ['id', 'name'],
        });
    
      	try {
            await listRole.forEach((role) =>
                {  let temp ={
                    id: role.id,
                    name:!role.name ? null : role.name,
                }
                listRoles.push(temp)
                })

            await listManagement.forEach((management) =>
                {  let temp ={
                    id: management.id,
                    name:!management.name ? null : management.name,
                }
                listManagements.push(temp)
                })
            
                res.render('listadmin/add', {
                    title: 'List Tambah Admin',
                    list_role:listRoles,
                    list_management:listManagements,
                    manajemen_admin_active:'active'
                });
            
		}
		catch (error) {
			req.flash('msg_error', error.message || `Eror mendapatkan admin`);
            res.redirect('/admin/listadmin')}
    }

    static async getById(req,res) {

        const id = req.params.id;

        let listRoles = [];
        let listManagements = [];

        let listRole = await  Role.findAll({
            attributes: ['id', 'name'],            
        });
        let listManagement = await Management.findAll({
            attributes: ['id', 'name'],
        });

        let list = await Admin.findOne({ 
			where: { id:id, deleted: 0} });
          
		let listSelected = {
            management: list.management.name ?? null,
            id: list.id,
            name: list.name ? hashed.decrypt(list.name) : null,
            email: list.email ? hashed.decrypt(list.email) : null,
            phone: list.phone ?? null,
            gender: list.gender ?? null,
		}
		try {
			 res.render('listadmin/edit', {
				 title: 'List Admin Edit',
				 list_admin_id:listSelected,
				 manajemen_admin_active:'active'
			 });
			
		}
		catch (error) {
			req.flash('msg_error', error.message || `Eror mendapatkan article`);
            res.redirect('/admin/listarticle')
		}
	}

 
	static async update(req, res) {
        const id = req.params.id;
        let checkPassword = !req.body.password ? null :req.body.password;
        let checkAdmin = await Admin.findOne({where:{id:id}})

        let password;
        const salt = bcrypt.genSaltSync();

        if(checkPassword != null){
        password = bcrypt.hashSync(req.body.password, salt);
        }
        else{
            password = checkAdmin.password
        }

		try {
			await Admin.update({
                name: hashed.encrypt(req.body.name),
                email: hashed.encrypt(req.body.email),
                phone: req.body.phone,
                gender:req.body.gender,
                password:password,
            },
            {where:{id:id}});

			req.flash(`msg_info', 'Sukses Update Admin ${req.body.name}`);

            res.redirect('/admin/listadmin')
        }

		catch (error) {
			req.flash('msg_error', error.message || `Eror Update Admin`);
            res.redirect('/admin/listadmin')
		}
	}
    

	static async listAdminView(req, res) {
        let listAdmin = [];
        let list = await Admin.findAll({   include: [
            {
            model: Management
        }, 
        {
            model: Role
        }, 
    
        ],
        where: { deleted: 0} });

        let no = 1;

        try{

            await list.forEach((admin) =>
            {  let temp ={
                 management: admin.management.name ?? null,
                 id: admin.id,
                 name:admin.name ? hashed.decrypt(admin.name) : null,
                 email: admin.email ? hashed.decrypt(admin.email) : null,
                 phone: admin.phone ?? null,
          
                 no: no++
             }
             listAdmin.push(temp)
             })

             res.render('listadmin', {
                title: 'List Admin',
                list_admin:listAdmin,
                manajemen_admin_active:'active'
            });

        }
        catch (error) {
        req.flash('msg_error', error.message || `Eror mendapatkan admin`);
        res.redirect('/admin/listadmin')}
    }

	static async registerAdmin(req, res) {

		const salt = bcrypt.genSaltSync();
		const password = bcrypt.hashSync(req.body.password, salt);

		try {
        let createAdmin = {
                name: hashed.encrypt(req.body.name),
                email: hashed.encrypt(req.body.email),
                phone: req.body.phone,
                password: password,
                gender:req.body.gender,
              
            }
			await Admin.create(createAdmin)
			req.flash('msg_info', 'Sukses Menambahkan Admin');

            res.redirect('/admin/listadmin')
		}
		catch (error) {
			req.flash('msg_error', error.message || `Eror menambahkan admin`);
            res.redirect('/admin/listadmin')
		}
	}

    static changePasswordView(req, res) {
		res.render('home/changepassword', {
            title: 'Change Password',
			// layout:true
            profile_active:'active'
        });
    }

    static async changePassword(req, res){
     
		try {
            let admin = await Admin.findOne({where:{email:req.session.email},raw:true})
            
            let isValid = bcrypt.compareSync(req.body.old_password, admin.password)

            if(isValid){
                const salt = bcrypt.genSaltSync();
                let new_password = bcrypt.hashSync(req.body.new_password, salt);	
              
                await Models.admin.update({
                    password : new_password
                }, {
                    where: { email: req.session.email }
                })
                
                req.flash('msg_info', `Sukses mengganti password`);
                res.redirect('/admin/change-password-admin-view');
            }
            else{
                req.flash('msg_error',  `Password Salah`);
                res.redirect('/admin/change-password-admin-view');
            }       
      
		}
		catch (error) {
            req.flash('msg_error', error.message || `Eror mengganti password`);
            res.redirect('/admin/change-password-admin-view');}
		
	}

    static async profileView(req, res){
        let list = await Admin.findOne({   include: [
            {
            model: Management
        }, 
        {
            model: Role
        }, 
    
        ],
        where: { email:req.session.email, deleted: 0} });


        try{

           let listSelected ={
                 management: list.management.name ?? null,
                 id: list.id,
                 name: list.name ? hashed.decrypt(list.name) : null,
                 email: list.email ? hashed.decrypt(list.email) : null,
                 phone: list.phone ?? null,
                 gender:list.gender ?? null,
               
             
                }

             res.render('home/profile', {
                title: 'Profile Admin',
                list_admin:listSelected,
                profile_active:'active'
            });

        }
        catch (error) {
        req.flash('msg_error', error.message || `Eror mendapatkan admin`);
        res.redirect('/admin/listadmin')}
        }

        static async updateProfile(req, res){
            const id = req.params.id;
    
            try{
                await Admin.update({name:hashed.encrypt(req.body.name), phone:req.body.phone},{where:{id:id}});
                req.flash('msg_info', 'Sukses Mengganti Profile');
    
                res.redirect('/admin/profile-admin')
             
    
            }
            catch (error) {
            req.flash('msg_error', error.message || `Eror update admin`);
            res.redirect('/admin/listadmin')}
            }
	
}

module.exports = ManajemenAdminController