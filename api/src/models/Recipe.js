const { DataTypes } = require('sequelize');
const { idGeneratorDB } = require('../utils/utilsModels')
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('recipe', {
    id:{
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      set(value){
        this.setDataValue('id',idGeneratorDB(value) ) 
        //Este lo manda a una funcion que retorna el id pero con una D al inicio, ejemplo, D42, lo hago con un set, que agarra el valor que se ingreso y hace algo con el mismo
      }

    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    resumen:{
      type: DataTypes.STRING,
      allowNull: false
    },

    healthScore:{
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 100,
      }
    },

    steps:{
      type: DataTypes.STRING,
      defaultValue: "No steps provided"
    },

    image:{
      type: DataTypes.STRING
    }

  });
};
