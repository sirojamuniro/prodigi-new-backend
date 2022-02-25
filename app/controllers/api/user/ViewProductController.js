const Models = require('../../../../models');
const Wislist = Models.wishlists
const User = Models.users
const Product = Models.products
const ViewProduct = Models.view_products;
const {
	Sequelize
} = require('../../../../models');
const Op = Sequelize.Op;


class ViewProductController {
	static async post(req, res) {
		try {
            const user = await User.findOne({where:{email:req.user.email,role:'user'}})
            const product = await Product.findOne({where:{id:req.body.product_id}})
        
                if(!user) {
                    res.status(400).send({ status: "Error", errors: [{message: "User not found" }]  })
                }else if(!product){
                    res.status(400).send({ status: "Error", errors: [{message: "Product not found" }]  })
                }

			const post = {
				user_id: user.id,
				product_id:req.body.product_id
			}
			await ViewProduct.create(post)
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
	static async get(req,res) {
		const {start, limit} = req.query;
		try {
            const user = await User.findOne({where:{email:req.user.email}})
            if (!user){
                res.status(400).send({ status: "Error", errors: [{message: "User not found" }]  })
            }
            
              await  ViewProduct.findAndCountAll({where:{user_id:user.id},
				include:[	{
                    model:Product,
     
                },     
        
        ],
            order:[['id','DESC']],
            limit: limit ? Number(limit) : null,
            offset: start ? Number(start) : null
					
                }).then(data => {

                    const resObj = data.rows.map(data => {
                      
                        return Object.assign(
                            {},
                            {	
                                id:data.id,
                                product_id:data.product.id,
                                name:data.product.name,                              
                                type:data.product.type,
                                brand:data.product.brand,
                                price: Number(data.product.price),
                               
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
}

module.exports = ViewProductController