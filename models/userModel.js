const {
    Sequelize,
    DataTypes,
    Model
} = require('sequelize');

const sequelize = require('../config/mysql');

class userModel extends Model { }

userModel.init({
    id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    countryCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    verified: {
        type: DataTypes.UUID(1),
        allowNull: false,
        defaultValue: 0
    },
    active: {
        type: DataTypes.ENUM('YES','NO'),
        allowNull: false,
        defaultValue: 'YES',
    },

},
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        underscored: true
    }
);



module.exports = userModel;

