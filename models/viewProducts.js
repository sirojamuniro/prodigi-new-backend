const sequelizeSoftDelete = require('sequelize-soft-delete');

module.exports = (sequelize, DataTypes) => {
    const ViewProducts = sequelize.define('view_products', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: DataTypes.INTEGER,
		product_id: DataTypes.INTEGER,
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
				fields: ['user_id','product_id']
			}
		]
	})

	ViewProducts.associate = function(models) {

		ViewProducts.belongsTo(models.products, {
			foreignKey: 'product_id',
			});

		ViewProducts.belongsTo(models.users, {
			foreignKey: 'user_id',
	
		});
     
	};

   const options = {field: 'deleted', deleted: 1}
   sequelizeSoftDelete.softDelete(ViewProducts, options)

   return ViewProducts
}