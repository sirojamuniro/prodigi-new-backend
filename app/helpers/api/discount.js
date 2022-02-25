module.exports = {
	discount(price,discount) {

        const checkPrice = price*(discount/100);

        const checkDiscount= price - checkPrice;
	
        const after_discount = Math.round(checkDiscount)

    	return after_discount
  	},


}