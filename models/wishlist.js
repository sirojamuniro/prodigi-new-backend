
module.exports = (sequelize, DataTypes) => {
    const Wishlist = sequelize.define('wishlists', {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: DataTypes.INTEGER,
		product_id: DataTypes.INTEGER,
		role:DataTypes.STRING,
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
	},{
		indexes: [
			{
				unique: false,
				fields: ['user_id','product_id']
			}
		]
	})

	Wishlist.associate = function(models) {
		Wishlist.belongsTo(models.users, {
            foreignKey:'user_id',
		});

		Wishlist.belongsTo(models.products, {
			foreignKey:'product_id',
		});
	};

    return Wishlist
}