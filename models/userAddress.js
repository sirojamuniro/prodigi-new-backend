const sequelizeSoftDelete = require('sequelize-soft-delete');

module.exports = (sequelize, DataTypes) => {
    const UserAddress = sequelize.define('user_addresses', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER,
		},
		email: DataTypes.STRING,
		name:DataTypes.STRING,
		phone:DataTypes.STRING,
		role:DataTypes.STRING,
		label: {
			type: DataTypes.STRING,
		},
		address: {
			type: DataTypes.TEXT,
		},
		province_id :{
			type: DataTypes.INTEGER,
		},
		city_id :{
			type: DataTypes.INTEGER,
		},
		sub_district_id :{
			type: DataTypes.INTEGER,
		},
		postal_code :{
			type: DataTypes.STRING,
		},
		map :{
			type: DataTypes.TEXT,
		},
		status: DataTypes.ENUM(['main']),
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
				fields: ['status','role']
			}
		]
	})

	UserAddress.associate = function(models) {
		UserAddress.belongsTo(models.users, {
		  foreignKey: 'user_id',
		//   as: "user",
		});
	};

	const options = {field: 'deleted', deleted: 1}
  	sequelizeSoftDelete.softDelete(UserAddress, options)

    return UserAddress
}
