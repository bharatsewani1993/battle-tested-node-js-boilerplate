const {
    Sequelize,
    DataTypes,
    Model
} = require('sequelize');

const sequelize = require('../config/mysql');

class permissionModel extends Model { }

permissionModel.init({
    id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    key: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    module: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    isDefault: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1 // All are system-defined now
    },
    createdBy: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0 // 0 = system/admin
    },
    active: {
        type: DataTypes.ENUM('YES','NO'),
        allowNull: false,
        defaultValue: 'YES'
    }
},
    {
        sequelize,
        tableName: 'permissions',
        timestamps: true,
        underscored: true
    }
);

module.exports = permissionModel;
