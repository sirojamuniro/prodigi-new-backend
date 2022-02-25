const sequelizeSoftDelete = require('sequelize-soft-delete');

module.exports = (sequelize, DataTypes) => {
    const Subdistrict = sequelize.define('subdistricts', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		city_id: DataTypes.INTEGER,
		name: DataTypes.STRING,
		tariff_code:DataTypes.STRING,
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
				fields: ['city_id']
			}
		]
	})

	Subdistrict.associate = function(models) {
		Subdistrict.belongsTo(models.cities, {
			foreignKey: 'city_id',
			// as: "city",
		});

		Subdistrict.hasMany(models.urban_villages, {
			// as: 'urban_villages'
		});
	};

	const options = {field: 'deleted', deleted: 1}
  	sequelizeSoftDelete.softDelete(Subdistrict, options)

    return Subdistrict
}