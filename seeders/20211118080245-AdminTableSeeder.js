'use strict';

const hashed = require('../app/helpers/hashed');
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync();

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('admin', [{
			id:1,
			name: hashed.encrypt('Superadmin'),
			email: hashed.encrypt('admin@example.com'),
			password: bcrypt.hashSync('123456', salt),
			photo:'default-user-profile.jpg',
			created_at: new Date(),
		}]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('admin', null, {});
	}
};
