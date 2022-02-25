const sequelizeSoftDelete = require('sequelize-soft-delete');

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('products', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		discount: DataTypes.DECIMAL,
        name:DataTypes.STRING,
		brand:DataTypes.STRING,
		type:DataTypes.STRING,
        price:DataTypes.DECIMAL,
        description :DataTypes.TEXT,
		quantity:DataTypes.INTEGER,
		number_of_sales:DataTypes.BIGINT,
		after_discount:DataTypes.DECIMAL,
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

    Product.associate = function(models) {

		Product.hasMany(models.wishlists, {
			foreignKey: 'product_id',
		});

		Product.hasMany(models.image_products, {
			foreignKey: 'product_id',
		});

     
	};

	const options = {field: 'deleted', deleted: 1}
  	sequelizeSoftDelete.softDelete(Product, options)

    return Product
}