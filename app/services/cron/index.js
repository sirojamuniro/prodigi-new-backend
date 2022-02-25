const Models = require('../../../models')
const User = Models.users;
const Flashsale = Models.flashsales;
const {
	Sequelize
} = require('../../../models');
const OneSignalService = require('../../../app/services/onesignal/onesignal');
const Product = Models.products;
const Category = Models.category_products;

class CronService {
    static async startFlashsale() {
        let flashsale = await Flashsale.findAll({include:[{
            model:Product,
            include:[{
                model:Category
            }]
        }],where:{is_active:false}})
        try {
            await flashsale.forEach(async (flash)=>{
            let now = Date.now() 
            let start = new Date(flash.start_time)
            if(now >= start){
                console.log('ini flash',flash)
                await Product.update({price:flash.price,discount:flash.discount,after_discount:flash.after_discount,quantity:flash.quantity},{where:{id:flash.product_id}})

                await Flashsale.update({is_active:true},{where:{id:flash.id}}) 

                let users = await User.findAll({where:{deleted:0}})
                    await users.forEach(async(user) => {
                        await OneSignalService.flashsaleStartNotification({
                                onesignal_id: [user.token_onesignal],
                                contents: `Produk ${flash.product.category_product.name} dengan nama produk ${flash.product.name} sedang flashsale ayo ikutan`,
                                title: `Flashsale Hanya Untukmu ${flash.title}`
                        })
                    
                    })
            }
        })
         
        } catch (error) {
            console.log(error);
        }
    }
    static async deleteFlashsale() {
        let flashsale = await Flashsale.findAll({where:{is_active:true,deleted:0}})
        try {
            if(flashsale){
            await flashsale.forEach(async (flash)=>{
            let now = Date.now() 
            let start = new Date(flash.end_time)

            if(now >= start){
                let parseFlashsale = JSON.parse(flash.temporary)

                await Product.update({price:parseFlashsale.price,discount:parseFlashsale.discount,after_discount:parseFlashsale.after_discount,quantity:parseFlashsale.quantity},{where:{id:flash.product_id}})
                
                await Flashsale.update({deleted:1,is_active:false},{where:{id:flash.id}}) 
 
            }
        })
    }else{
        console.log("Not progress")
    }
         
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = CronService;