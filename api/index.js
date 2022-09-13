//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn, CrearDietas, crearRecetas } = require('./src/db.js');
const Recipe = require('./src/models/Recipe.js');

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  
  server.listen(3001, () => {
    try {
      conn.authenticate()
      console.log("Conexion a la DB exitosa")
      //CrearDietas()
      //console.log("Dietas Creadas")
      //crearRecetas()
      //console.log("Receta de Prueba Creada")
    } catch (error) {
      console.log("Error al conectar a la DB: " + error.message )
    }
    console.log('Server is UP!, listening at 3001'); // eslint-disable-line no-console
  });
})