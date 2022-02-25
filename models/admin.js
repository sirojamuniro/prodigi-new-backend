const bcrypt = require("bcrypt");
const sequelizeSoftDelete = require('sequelize-soft-delete');

module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('admin', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		photo: DataTypes.STRING,
		name: DataTypes.STRING,
		gender: DataTypes.ENUM(['male','female']),
		dob: DataTypes.DATEONLY,
        email: DataTypes.STRING,
		phone: DataTypes.STRING,
        password: DataTypes.STRING,
		token_firebase:DataTypes.TEXT,
    
		deleted: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
		}
	}, {
		freezeTableName: true,
        timestamps: false,
		defaultScope: {
			where: {
				deleted: 0
			}
		}
	},{
		indexes: [
			{
				unique: false,
				fields: ['gender','role_id','management_id']
			}
		]
	})
	

	Admin.prototype.toJSON =  function () {
		var values = Object.assign({}, this.get());

		delete values.password;
		delete values.confirm_password;
		return values;
	}

	Admin.associate = function(models) {
		
	};

	const options = {field: 'deleted', deleted: 1}
  	sequelizeSoftDelete.softDelete(Admin, options)

    return Admin
}