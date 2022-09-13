require('dotenv').config();
const { Sequelize, Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const Sqlite3 = require('sqlite3')
const {dietTypes} = require('./utils/utilsModels')
//const {DB_USER, DB_PASSWORD, DB_HOST,} = process.env;
/*
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/food`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
*/
const pathDB = "./src/food_pi.sqlite"
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: pathDB,
  logging:false,
  dialectOptions: {
    mode: Sqlite3.OPEN_READWRITE | Sqlite3.OPEN_FULLMUTEX
  }
});



const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Recipe, Diet } = sequelize.models;

// Aca vendrian las relaciones
// Recipe <-N----------M-> Diet
Recipe.belongsToMany(Diet, {through: 'Recipe_Diet'})
Diet.belongsToMany(Recipe, {through: 'Recipe_Diet'})
//Creamos las dietas predeterminadas
const CrearDietas =  async () => {
  for(let i = 0; i < dietTypes.length; i++){
    //console.log("Creando dieta: "+ dietTypes[i])
    await Diet.create({
      name: dietTypes[i]
    })
  }
}
//creamos una receta de prueba
const crearRecetas = async () => {
  const recetaPrueba = await Recipe.create({
    id: 99,
    name: "Receta de Prueba",
    resumen: "Esta receta es de prueba, para probar",
    healthScore: 88,
    steps: "1-Soy prueba :D"

  })
  const diet = await Diet.findOne({where: {name: "Vegan"}})
  await recetaPrueba.addDiet(diet) 
}

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
  CrearDietas,
  crearRecetas,
  Op
};
