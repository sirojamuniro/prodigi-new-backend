const sequelizeSoftDelete = require('sequelize-soft-delete');

module.exports = (sequelize, DataTypes) => {
    const ImageProducts = sequelize.define('image_products', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		product_id: DataTypes.INTEGER,
        image:DataTypes.STRING,
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
	})

    ImageProducts.associate = function(models) {

		ImageProducts.belongsTo(models.products, {
			foreignKey: 'product_id',
	
		});
     
	};

	const options = {field: 'deleted', deleted: 1}
  	sequelizeSoftDelete.softDelete(ImageProducts, options)

    return ImageProducts
}