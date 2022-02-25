const { validationResult } = require('express-validator');
const Models = require('../../../models');
const bcrypt = require('bcrypt');
const hashed = require('../../helpers/hashed');

class ManajemenUserController {


    static async listUserView(req, res) {
        let listUser = [];
        let list = await  Models.users.findAll({ where: { deleted: 0,role:'user' } });
        let no = 1;
        
       await list.forEach((user) =>
       {  let temp ={
            name: hashed.decrypt(user.name) ?? null,
            id: user.id,
            title: user.title ?? null,
            email:hashed.decrypt(user.email) ?? null,
            phone: hashed.decrypt(user.phone) ?? null,
            nik: hashed.decrypt(user.nik) ?? null,
            status: user.status ?? null,
            no: no++
        }
        listUser.push(temp)
        })
    
        res.render('user', {
            title: 'List User',
            list_user:listUser,
            manajemen_user_active:'active'
        });
    }

    static async listDetailUserView(req, res) {

        const id = req.params.id;

        // let listUser = [];
        let list = await  Models.users.findOne({ where: {id:id, deleted: 0,role:'user' } });
        let no = 1;
        
      
        let listUser ={
            name: hashed.decrypt(list.name) ?? null,
            id: list.id,
            title: list.title ?? null,
            email:hashed.decrypt(list.email) ?? null,
            place_dob:list.place_dob ?? null,
            dob:list.dob ?? null,
            phone: hashed.decrypt(list.phone) ?? null,
            nik: hashed.decrypt(list.nik) ?? null,
            status: list.status ?? null,
            no: no++
        }
     
    
        res.render('user/show', {
            title: 'Detail List User',
            list_user_id:listUser,
            manajemen_user_active:'active'
        });
    }

}

module.exports = ManajemenUserController
