const {
    Sequelize,
    DataTypes,
    Model
} = require('sequelize');

const sequelize = require('../config/mysql');

class roleModel extends Model { }

roleModel.init({
    id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    organizationId: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    isDefault: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0  // 0: Custom role, 1: Default role (owner, admin, member)
    },
    createdBy: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    active: {
        type: DataTypes.ENUM('YES','NO'),
        allowNull: false,
        defaultValue: 'YES'
    }
},
    {
        sequelize,
        tableName: 'roles',
        timestamps: true,
        underscored: true
    }
);

module.exports = roleModel; 