const discount = require('../../../helpers/api/discount')
const Models = require('../../../../models');
const {
	Sequelize
} = require('../../../../models');
const User = Models.users;
const Product = Models.products;
const ImageProduct = Models.image_products;
const Wishlist = Models.wishlists;
const Op = Sequelize.Op;

class ProductController {
	static async getDetail(req, res) {
		const {
			start,
			limit
		} = req.query;

		const user = await User.findOne({
			where: {
				email: req.user.email
			}
		})

		if (!user) {
			res.status(400).send({
				status: "Error",
				errors: [{
					message: "User not found"
				}]
			})
		}
		try {

		let data=	await Product.findAndCountAll({
				include: [
					{
						model: Wishlist,
						include: [{
							model: User,
							attributes: ['id', 'title', 'email', 'role', 'status']
						}],

						limit: limit ? Number(limit) : null,
						offset: start ? Number(start) : null
					}
				],
				order: [
					['id', 'DESC']
				],
				limit: limit ? Number(limit) : null,
				offset: start ? Number(start) : null
			})
				
				const resObj = data.rows.map(data => {
					console.log('ini data',data)
					const after_discount = discount.discount(data.price, data.discount)

					let status = false;
					for (let wishlist of data.wishlists) {
						if (wishlist.user_id === user.id && wishlist.role === "user" && wishlist.product_id == data.id) {
							status = true
						}
					}
					let wishlist_id = '';
					for (let this_wishlist of data.wishlists) {
				
						if (this_wishlist.user_id == user.id && this_wishlist.role == "user" && this_wishlist.product_id == data.id) {
							wishlist_id = this_wishlist.id
						}

					}

					return Object.assign({}, {
						id: data.id,
						name: data.name,
						price: Number(data.price),
						discount: Number(data.discount),
						brand: data.brand,
						description: data.description,
						type: data.type,
						stock: Number(data.quantity),
						after_discount: Number(after_discount),
						product_code: data.product_code,
						wishlist_id: wishlist_id ? wishlist_id : null,
						status_wishlist: status,
						

					})
				})

				res.status(200).send({
					message: 'Success',
					data: {
						count: data.count,
						rows: resObj
					},

				});
		
		} catch (error) {
			console.log(error);
			res.status(400).send({
				status: "Error",
				errors: [{
					message: error.message
				}]
			})
		}
	}

	static async get(req, res) {
		const {
			start,
			limit
		} = req.query;

		const user = await User.findOne({
			where: {
				email: req.user.email
			}
		})
		try {

			await Product.findAndCountAll({

				include: [
					{
						model: Wishlist,
						limit: limit ? Number(limit) : null,
						offset: start ? Number(start) : null
					},
					
					{
						model: ImageProduct,
					}


				],
				order: [
					['id', 'DESC']
				],
				limit: limit ? Number(limit) : null,
				offset: start ? Number(start) : null
			}).then(data => {
				const resObj = data.rows.map(data => {

					let status = false;
					for (let wishlist of data.wishlists) {
						if (wishlist.user_id == user.id && wishlist.role == "user" && wishlist.product_id == data.id) {
							status = true
						}
					}
					let wishlist_id = '';
					for (let this_wishlist of data.wishlists) {
		
						if (this_wishlist.user_id == user.id && this_wishlist.role == "user" && this_wishlist.product_id == data.id) {
							wishlist_id = this_wishlist.id
						}
					}
				
					const after_discount = discount.discount(data.price, data.discount)
					let image =  data.image_products.map(data=>{
						return Object.assign({}, {
					   image:data.image
					   })
				   })
					return Object.assign({}, {
						id: data.id,
						name: data.name,
						price: Number(data.price),
						discount: Number(data.discount),
						type: data.type,
						stock: Number(data.quantity),
						after_discount: Number(after_discount),
						brand: data.brand,
						wishlist_id: wishlist_id ? wishlist_id : null,
						status_wishlist: status,
						image:image

					})
				})
				res.status(200).send({
					message: 'Success',
					data: {
						count: data.count,
						rows: resObj
					},
				});
			})
		} catch (error) {
			console.log(error);
			res.status(400).send({
				status: "Error",
				errors: [{
					message: error.message
				}]
			})
		}
	}

	static async getById(req, res) {
		try {
			const id = req.params.id;

			const user = await User.findOne({
				where: {
					email: req.user.email
				}
			})

			await Product.findAndCountAll({
				where: {
					id: id
				},
				include: [
					{
						model: Wishlist,
						include: [{
							model: User,
							attributes: ['id', 'title', 'email', 'role', 'status']
						}]
					},
				]
			}).then((data) => {
				const resObj = data.rows.map(data => {

					let status = false;
					for (let wishlist of data.wishlists) {
						if (wishlist.user_id === user.id && wishlist.role === "user" && wishlist.product_id == data.id) {
							status = true
						}
					}
					let wishlist_id = '';
					for (let this_wishlist of data.wishlists) {
						if (this_wishlist.user_id === user.id && this_wishlist.role === "user" && this_wishlist.product_id == data.id) {
							wishlist_id = this_wishlist.id
						}
					}
					const after_discount = discount.discount(data.price, data.discount)

					return Object.assign({}, {

						id: data.id,
						name: data.name,
						price: Number(data.price),
						discount: Number(data.discount),
						type: data.type,
						description: data.description,
						brand: data.brand,
						stock: Number(data.quantity),
						after_discount: Number(after_discount),
						wishlist_id: wishlist_id ? wishlist_id : null,
						status_wishlist: status,
						image: data.image,

					})
				})
				res.status(200).send({
					message: 'Success',
					data: {
						count: data.count,
						rows: resObj
					},

				});
			})
		} catch (error) {
			console.log(error);
			res.status(400).send({
				status: "Error",
				errors: [{
					message: error.message
				}]
			})
		}
	}

	static async searchProductPriceMaxAndMin(req, res) {
		const {
			start,
			limit
		} = req.query;

		const search = req.body.search;

		const sort = req.body.sort;

		const indicator = req.body.indicator

		const id = indicator != "" ? indicator : "name";

		const price = sort != "" ? sort : "ASC";

		const user = await User.findOne({
			where: {
				email: req.user.email
			}
		})

		try {
			await Product.findAndCountAll({
				where: {
					[Op.or]: [{
							name: {
								[Op.like]: `%${search}%`
							}
						},
						{
							price: {
								[Op.like]: `%${search}%`
							}
						},
						{
							brand: {
								[Op.like]: `%${search}%`
							}
						},
						{
							discount: {
								[Op.like]: `%${search}%`
							}
						},
						{
							type: {
								[Op.like]: `%${search}%`
							}
						}
					],

				},

				include: [{					
						model: Wishlist,
						include: [{
							model: User,
							attributes: ['id', 'title', 'email', 'role', 'status']
						}],
						limit: limit ? Number(limit) : null,
						offset: start ? Number(start) : null
					},
				],
				order: [
					[`${id}`, `${price}`]
				],
				limit: limit ? Number(limit) : null,
				offset: start ? Number(start) : null
			}).then((data) => {
				const resObj = data.rows.map(data => {

					let status = false;
					for (let wishlist of data.wishlists) {
						if (wishlist.user_id == user.id && wishlist.role == "user" && wishlist.product_id == data.id) {
							status = true
						}
					}
					let wishlist_id = '';
					for (let this_wishlist of data.wishlists) {
						if (this_wishlist.user_id === user.id && this_wishlist.role === "user" && this_wishlist.product_id == data.id) {
							wishlist_id = this_wishlist.id
						}
					}
					const after_discount = discount.discount(data.price, data.discount)
					return Object.assign({}, {

						id: data.id,
						name: data.name,
						price: Number(data.price),
						discount: Number(data.discount),
						type: data.type,
						description: data.description,
						brand: data.brand,						
						stock: Number(data.quantity),
						after_discount: Number(after_discount),
						wishlist_id: wishlist_id ? wishlist_id : null,
						status_wishlist: status,
						image: data.image,
					})
				})
				res.status(200).send({
					message: 'Success',
					data: {
						count: data.count,
						rows: resObj
					},
				});
			})
		} catch (error) {
			console.log(error);
			res.status(400).send({
				status: "Error",
				errors: [{
					message: error.message
				}]
			})
		}
	}

	static async bestSellerProduct(req, res) {

		try {

			const {
				start,
				limit
			} = req.query;
			const user = await User.findOne({
				where: {
					email: req.user.email,
					deleted:0,
					role:'user'
				}
			})

			await Product.findAndCountAll({
				include: [
					{
						model: Wishlist,
						include: [{
							model: User,
							attributes: ['id', 'title', 'email', 'role', 'status']
						}],
						limit: limit ? Number(limit) : null,
						offset: start ? Number(start) : null
					},
				],
				order: [
					['number_of_sales', 'DESC']
				],
				limit: limit ? Number(limit) : null,
				offset: start ? Number(start) : null
			}).then((data) => {
				const resObj = data.rows.map(data => {

					let status = false;
					for (let wishlist of data.wishlists) {
						if (wishlist.user_id === user.id && wishlist.role === "user"  && wishlist.product_id == data.id) {
							status = true
						}
					}
					let wishlist_id;
					for (let this_wishlist of data.wishlists) {
					
						if (this_wishlist.user_id === user.id && this_wishlist.role === "user" && this_wishlist.product_id == data.id) {
							wishlist_id = this_wishlist.id
						}
					}
			
					const after_discount = discount.discount(data.price, data.discount)

					return Object.assign({}, {

						id: data.id,					
						name: data.name,
						price: Number(data.price),
						discount: Number(data.discount),
						type: data.type,
						description: data.description,
						brand: data.brand,
						stock: Number(data.quantity),
						after_discount: after_discount,					
						wishlist_id: wishlist_id ? wishlist_id : null,
						status_wishlist: status,
						image: data.image,

					})
				})
				res.status(200).send({
					message: 'Success',
					data: {
						count: data.count,
						rows: resObj
					},

				});
			})
		} catch (error) {
			console.log(error);
			res.status(400).send({
				status: "Error",
				errors: [{
					message: error.message
				}]
			})
		}
	}

}



module.exports = ProductController