const {
    Sequelize,
    DataTypes,
    Model
} = require('sequelize');

const sequelize = require('../config/mysql');
const userModel = require('./userModel');

class organizationModel extends Model { }

organizationModel.init({
    id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(1000),
        allowNull: true,
    },
    ownerId: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: userModel,
            key: 'id'
        }
    },
    status:{
        type:DataTypes.ENUM('DRAFT','PUBLISHED','ARCHIVED'),
        defaultValue:'DRAFT'
    },
    active: {
        type: DataTypes.ENUM('YES','NO'),
        allowNull: false,
        defaultValue: 'YES',
    },
},
    {
        sequelize,
        tableName: 'organizations',
        timestamps: true,
        underscored: true
    }
);

module.exports = organizationModel; 