const {
    validationResult
} = require('express-validator');
const Models = require('../../../models');
const discount = require('../../helpers/api/discount')
const bcrypt = require('bcrypt');
const hashed = require('../../helpers/hashed');
const Product = Models.products;
const ImageProduct = Models.image_products;
const path = require('path');
const fs = require('fs');

class ManajemenProductController {

    static async addProductView(req, res) {
            res.render('product/addproduct', {
                title: 'Produk',
                list_product_active:'active'
            });
        
    }


    static async listProductView(req, res) {
        let listProduct = [];
        let list = await Product.findAll({
            order: [
                ['id', 'DESC']
            ],
        })
        let no = 1;
        await list.forEach((product) => {
            let temp = {
                id: product.id,
                name: !product.name ? null : product.name,
                price: !product.price ? null : Number(product.price),
                after_discount:!product.after_discount ? null :Number(product.after_discount),
                discount: !product.discount ? null : Number(product.discount),
				brand: product.brand ??null,
				type: product.type ?? null,
                description: !product.description ? null : product.description,
                quantity: !product.quantity ? null : Number(product.quantity),
                number_of_sales: !product.number_of_sales ? null : Number(product.number_of_sales),
                no: no++
            }
            listProduct.push(temp)
        })

        res.render('product', {
            title: 'List Product',
            list_product: listProduct,
            list_product_active: 'active'
        });
    }

    static async post(req, res) {
		if (req.files['image'] === undefined || req.files['image2'] === undefined ||req.files['image3'] === undefined ) {
            res.status(422).json({
                message: 'Gambar harus di uploads'
            });
            return;
        }
		try {
            let fileName = req.file != null ? req.file.filename : null
            console.log('ini fileanme',fileName)
		
			let after_discount = req.body.discount ? discount.discount(req.body.price, req.body.discount) : req.body.price

			const post = {
				discount: req.body.discount == "" ? null : req.body.discount, 
				name: req.body.name,
				price: req.body.price,
				brand: req.body.brand,
				type: req.body.type,
				description: req.body.description,
				quantity: req.body.quantity,
				after_discount: after_discount ?? null,
				// image: fileName,
			}

           let createProduct= await Product.create(post);
			await ImageProduct.create({
				product_id:createProduct.id,
				image:req.files['image'][0].filename
			})
			await ImageProduct.create({
				product_id:createProduct.id,
				image:req.files['image2'][0].filename
			})
			await ImageProduct.create({
				product_id:createProduct.id,
				image:req.files['image3'][0].filename
			})

            req.flash('msg_info', 'Sukses Menambahkan Produk');

            res.redirect('/admin/listproduct')
         
				
		} catch (error) {
            req.flash('msg_error', error.message || `Eror menambahkan Produk`);
            res.redirect('/admin/listproduct')
		}
	}

    static async getById(req,res) {

        const id = req.params.id;
		try {
		

        let list = await Product.findOne({ 
			where: { id:id, deleted: 0} });

	
		let listSelected = {
            id: list.id,
			
            name: !list.name ? null : list.name,
            price: !list.price ? null : list.price,
            after_discount:!list.after_discount ? null : list.after_discount,
            discount: !list.discount ? null : list.discount,
            description: !list.description ? null : list.description,
            quantity: !list.quantity ? null : list.quantity,
            number_of_sales: !list.number_of_sales ? null : list.number_of_sales,
			image: !list.image ? null : list.image,
     
			
		}
	
			 res.render('product/edit', {
				 title: 'List Produk Id',
				 list_product_id:listSelected,
				 list_product_active:'active'
			 });
			
		}
		catch (error) {
			req.flash('msg_error', error.message || `Eror mendapatkan Produk`);
            res.redirect('/admin/listproduct')
		}
	}

    static async update(req,res) {

		const id = req.params.id;
	
		let checkProduct = await Product.findOne({where:{id:id, deleted:0}})

		let fileName = req.file != null ? req.file.filename : null;

		let after_discount = req.body.discount ? discount.discount(req.body.price, req.body.discount) : req.body.price;
		try {
			if(checkProduct.image != null){
				if(fileName != null){

					fs.unlinkSync(path.join(__dirname, process.env.PATH_PRODUCT + '/' + checkProduct.image))	
					
					await Product.update({
							discount: req.body.discount,
							price: req.body.price,
							brand: req.body.brand,
							name: req.body.name,
							price: req.body.price,
							description: req.body.description,
							quantity: req.body.quantity,
							after_discount: after_discount,
							image: fileName,
						
					}, {
						where: { id: id}
					})
		
					req.flash('msg_info', 'Sukses Update Produk');

					res.redirect('/admin/listproduct')
			}else {
				await Product.update({
					discount: req.body.discount,
							price: req.body.price,
							brand: req.body.brand,
							name: req.body.name,
							price: req.body.price,
							description: req.body.description,
							quantity: req.body.quantity,
							after_discount: after_discount,
							
				}, {
					where: { id: id}
				})
	
				req.flash('msg_info', 'Sukses Update Produk');

				res.redirect('/admin/listproduct')
			}
		}
		else{

			if(fileName != null){
				
				await Product.update({
					discount: req.body.discount,
					price: req.body.price,
					brand: req.body.brand,
					name: req.body.name,
					price: req.body.price,
					description: req.body.description,
					quantity: req.body.quantity,
					after_discount: after_discount,
					image: fileName,
					
				}, {
					where: { id: id}
				})
	
				req.flash('msg_info', 'Sukses Membuat Produk');

				res.redirect('/admin/listproduct')
			}else {
				await Product.update({
					discount: req.body.discount,
					price: req.body.price,
					brand: req.body.brand,
					name: req.body.name,
					price: req.body.price,
					description: req.body.description,
					quantity: req.body.quantity,
					after_discount: after_discount,
					image: fileName,
					
				}, {
					where: { id: id}
				})

				req.flash('msg_info', 'Sukses Membuat Produk');

				res.redirect('/admin/listproduct')
			}
		}
			
		}
		catch (error) {
			
			req.flash('msg_error', 'Eror update Produk');
            res.redirect('/admin/listproduct')
		}
	}


    static async delete(req, res) {

		const {id} = req.params

		try {

			await Product.update({
					deleted: true,

				}, {
					where: {
						id: id
					}
				})

            req.flash('msg_info', 'Sukses delete Produk');

            res.redirect('/admin/listproduct')
             
				
		} catch (error) {
            req.flash('msg_error', error.message || `Eror delete Produk`);
            res.redirect('/admin/listproduct')
		}
	}

}

module.exports = ManajemenProductController