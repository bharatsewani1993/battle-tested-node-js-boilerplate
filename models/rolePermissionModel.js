const {
    Sequelize,
    DataTypes,
    Model
} = require('sequelize');

const sequelize = require('../config/mysql');

class rolePermissionModel extends Model { }

rolePermissionModel.init({
    id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    roleId: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    permissionId: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    createdBy: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    active: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1
    }
},
    {
        sequelize,
        tableName: 'role_permissions',
        timestamps: true,
        underscored: true
    }
);

module.exports = rolePermissionModel; 