const {
    Sequelize,
    DataTypes,
    Model
} = require('sequelize');

const sequelize = require('../config/mysql');

class organizationUserModel extends Model { }

organizationUserModel.init({
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
    userId: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    roleId: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    fullName:{
        type:DataTypes.STRING(),
        required:true,
        allowNull:false,
        defaultValue:'XYZ'
    },
    inviteStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'accepted'  // Possible values: 'pending', 'accepted', 'rejected'
    },
    invitedBy: {
        type: DataTypes.INTEGER(),
        allowNull: true
    },
    active: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
    },
},
    {
        sequelize,
        tableName: 'organization_users',
        timestamps: true,
        underscored: true
    }
);

module.exports = organizationUserModel;