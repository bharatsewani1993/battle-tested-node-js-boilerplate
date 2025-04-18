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
    organizationId: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    key: {
        type: DataTypes.STRING(100),
        allowNull: false
        // Examples: 'create_project', 'delete_task', 'invite_member'
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    module: {
        type: DataTypes.STRING(50),
        allowNull: false
        // Examples: 'projects', 'tasks', 'members'
    },
    isDefault: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0  // 0: Custom permission, 1: Default permission
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
        tableName: 'permissions',
        timestamps: true,
        underscored: true
    }
);

module.exports = permissionModel; 