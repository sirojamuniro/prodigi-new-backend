const sequelizeSoftDelete = require('sequelize-soft-delete');

module.exports = (sequelize, DataTypes) => {
    const UrbanVillage = sequelize.define('urban_villages', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		subdistrict_id: DataTypes.INTEGER,
		name: DataTypes.STRING,
		zip_code:DataTypes.INTEGER,
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
				fields: ['subdistrict_id']
			}
		]
	})

	UrbanVillage.associate = function(models) {
		UrbanVillage.belongsTo(models.subdistricts, {
			foreignKey: 'subdistrict_id',
			// as: "subdistrict",
		});
	};

	const options = {field: 'deleted', deleted: 1}
  	sequelizeSoftDelete.softDelete(UrbanVillage, options)

    return UrbanVillage
}