const sequelizeSoftDelete = require('sequelize-soft-delete');

module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define('cities', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		province_id: DataTypes.INTEGER,
		name: DataTypes.STRING,
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
		},
		deleted: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
	},
	 {
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
				fields: ['province_id']
			}
		]
	})

	City.associate = function(models) {
		City.belongsTo(models.provinces, {
			foreignKey: 'province_id',
			// as: "province",
		});

		City.hasMany(models.subdistricts, {
		
		});

	};

	const options = {field: 'deleted', deleted: 1}
  	sequelizeSoftDelete.softDelete(City, options)

    return City
}