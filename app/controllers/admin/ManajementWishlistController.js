const Models = require('../../../models');
const Wishlist = Models.wishlists;
const Product = Models.products;
const {
	Sequelize
} = require('../../../models');

const Count = require('../../helpers/count')

class ManajementWishlistController {
	static async listView(req, res) {
        let listWishlist = []
        let no = 1;
        try{
            let countProduct = await Wishlist.findAll({
				include:[{
					model:Product
				}],
                raw : true ,
                nest: true ,
			})

			let counts = await Count.count(countProduct)
             
            await counts.forEach((prod) => {
                let temp = {
                    id: prod.id,
                    name: prod.product.name ?? null,
                    price: prod.product.price ?? null,
                    after_discount:prod.product.after_discount ?? null,
                    discount: prod.product.discount ?? null,
                    brand: prod.product.brand ?? null,
                    type: prod.product.type ?? null,
                    description: prod.product.description ?? null,
                    quantity: prod.product.quantity ?? null,
                    number_of_sales: prod.product.number_of_sales ?? null,
                    count:prod.count ?? null,
                    no: no++
                }
                listWishlist.push(temp)
            })
            res.render('wishlist', {
                title: 'List Wishlist',
                list_wishlist: listWishlist,
                list_wishlist_active: 'active'
            });
    
        }
        catch (error) {
        req.flash('msg_error', error.message || `Eror mendapatkan wishlist`);
        res.redirect('/admin/listwishlist')}
        
        
    }
	
}

module.exports = ManajementWishlistController