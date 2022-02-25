'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, {
	dialect: "mysql",
	define: {
		underscored: true,
		freezeTableName: true, //use singular table name
		timestamps: false,  // I do not want timestamp fields by default
	  },
	  dialectOptions: {
		useUTC: false, //for reading from database
		dateStrings: true,
		typeCast: function (field, next) { // for reading from database
		  if (field.type === 'DATETIME') {
			return field.string()
		  }
			return next()
		  },
	  },
	  timezone: '+07:00'
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//initial models
// db.banner = require('./banner')(sequelize, Sequelize);

module.exports = db;
