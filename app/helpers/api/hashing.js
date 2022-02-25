const bcrypt = require('bcrypt')
module.exports = (password, hash) => {
    return bcrypt.compareSync(password, hash) 
}