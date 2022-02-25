const bcrypt = require('bcrypt')

const saldRound = 5
const sald = bcrypt.genSaltSync(saldRound)

module.exports = (password) => {
    return bcrypt.hashSync(password, sald)
}