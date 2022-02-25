const ServicePickupRequest = require('../services/pickupRequest');

async function generate(){
	const prefix = 'PURW-';
	let gmt = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
	let converted = new Date(gmt);
	let year = `${converted.getFullYear()}`;
	let month = `${converted.getMonth()+1}`;
	let date = `${converted.getDate()}`;
	const new_date = `${year+month+date}`;

	let generated = "";
	let i = 1;
	let check;

	do{
		generated = `${prefix + new_date + zeroPad(i,4)}`;
		check = await ServicePickupRequest.getByNoTransaction(generated);
		i++;
	} while(check != null);

	return generated;
}

function zeroPad(num, places) {
	var zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}

module.exports = {
	generate
};