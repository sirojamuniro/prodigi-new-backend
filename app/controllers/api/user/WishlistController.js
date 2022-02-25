const Models = require('../../../../models');
const Wislist = Models.wishlists
const User = Models.users
const Merchant = Models.merchants
const Product = Models.products
const discount = require('../../../helpers/api/discount');
const Category = Models.category_products;
const {
	Sequelize
} = require('../../../../models');
const Op = Sequelize.Op;


class WislistController {
	static async post(req, res) {
		try {
            const user = await User.findOne({where:{email:req.user.email,role:'user'}})
            const product = await Product.findOne({where:{id:req.body.product_id}})
            let checkWishlist = await Wislist.findAll({where:{product_id:req.body.product_id,user_id:user.id,role:'user'}})
                if(!user) {
                    res.status(400).send({ status: "Error", errors: [{message: "User not found" }]  })
                }else if(!product){
                    res.status(400).send({ status: "Error", errors: [{message: "Product not found" }]  })
                }else
                if(checkWishlist.length > 0){
                    throw ({
                        message: 'This product is already on your wishlist'
                     })
                }

			const post = {
				user_id: user.id,
                role:user.role,
				product_id:req.body.product_id
			}
			await Wislist.create(post)
			.then((data) => {				
				res.status(200).json({
					message: 'Success',
					data: data
				});
			});
		}
		catch (error) {
			console.log(error);
			res.status(400).send({ status: "Error", errors: [{message: error.message }]  })
		}
	}

	static async getMyWishlist(req,res) {
		const {start, limit} = req.query;
		try {
            const user = await User.findOne({where:{email:req.user.email}})
            if (!user){
                res.status(400).send({ status: "Error", errors: [{message: "User not found" }]  })
            }
            
              await  Wislist.findAndCountAll({where:{user_id:user.id,role:'user'},
				include:[	{
                    model:Product,
                    include:[{
                        model:Category
                    }]
     
                },
                {
                    model:User,
                },            
        
        ],
            order:[['id','DESC']],
            limit: limit ? Number(limit) : null,
            offset: start ? Number(start) : null
					
                }).then(data => {

                    const resObj = data.rows.map(data => {
                        const after_discount = discount.discount(data.product.price,data.product.discount)
                        return Object.assign(
                            {},
                            {	
                                id:data.id,
                                product_id:data.product.id,
                                category:data.product.category_product.name,
                                name:data.product.name,
                                image:data.product.image,
                                discount:Number(data.product.discount),
                                type_pressure:data.product.type_pressure,
                                product_code:data.product.product_code,
                                price: Number(data.product.price),
                                after_discount:after_discount
                            }
                        )
                    })
                    res.status(200).send({
                        message: 'Success',
                        data:{
                            count:data.count,
                            rows:resObj
                        },
                        
                    });
                })
		}
		catch (error) {
			console.log(error);
			res.status(400).send({  status: "Error", data: error.message })
		}
	}

    static async delete(req, res) {
        const id = req.params.id;
		try {
            const user = await User.findOne({where:{email:req.user.email}})
            const product = await Product.findOne({where:{id:req.body.product_id}})
                if(!user) {
                    res.status(400).send({ status: "Error", errors: [{message: "User not found" }]  })
                }else if(!product){
                    res.status(400).send({ status: "Error", errors: [{message: "Product not found" }]  })
                }

			await Wislist.destroy({where:{product_id:req.body.product_id,user_id:user.id,role:'user'}})
			.then((data) => {				
				res.status(200).json({
					message: 'Success',
					data: data
				});
			});
		}
		catch (error) {
			console.log(error);
			res.status(400).send({ status: "Error", errors: [{message: error.message }]  })
		}
	}
    
    static async deleteAll(req, res) {
        const id = req.params.id;
		try {

            await Merchant.update({token_firebase:null},{where:{token_firebase:{[Op.ne]:null}}})
            await User.update({token_firebase:null},{where:{token_firebase:{[Op.ne]:null}}})			
				res.status(200).json({
					message: 'Success',
					// data: data
				});
    }
		catch (error) {
			console.log(error);
			res.status(400).send({ status: "Error", errors: [{message: error.message }]  })
		}
	}
	
}

module.exports = WislistController