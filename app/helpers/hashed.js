//encrypt dan dekrip metode 1 

// const crypto = require('crypto');
// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);

// function encrypt(text) {
//  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
//  let encrypted = cipher.update(text);
//  encrypted = Buffer.concat([encrypted, cipher.final()]);
//  return JSON.stringify({ iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') });
// }

// function decrypt(text) {
// text = JSON.parse(text)
//  let iv = Buffer.from(text.iv, 'hex');
//  let encryptedText = Buffer.from(text.encryptedData, 'hex');
//  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
//  let decrypted = decipher.update(encryptedText);
//  decrypted = Buffer.concat([decrypted, decipher.final()]);
//  return decrypted.toString();
// }

// enkrip dan dekrip string metode 2
const crypto = require('crypto');
const ENC_KEY =  "bf3c199c2470cb477d907b1e0917c17b"; // set random 32 char encryption key
const IV = "5183666c72eec9e4"; // vector 16 

function encrypt(text) {
	let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
	let encrypted = cipher.update(text, 'utf8', 'base64');
	encrypted += cipher.final('base64');
	return JSON.stringify(encrypted);
}

function decrypt(encrypted) {
	if (encrypted == null || encrypted == "" )
	return encrypted;
	encrypted = JSON.parse(encrypted)
	let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
	let decrypted = decipher.update(encrypted, 'base64', 'utf8');
	return (decrypted += decipher.final('utf8'));
}

module.exports = {
    encrypt,
    decrypt
};