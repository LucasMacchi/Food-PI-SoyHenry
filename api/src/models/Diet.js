const { DataTypes } = require('sequelize');
const {dietTypes} = require('../utils/utilsModels')

module.exports = (sequelize) => {
    sequelize.define('diet', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true    
        },
        name: {
            type: DataTypes.ENUM(dietTypes),
            validator: {
                isIn: [dietTypes]
            }
        }
    },{timestamps:false})
}