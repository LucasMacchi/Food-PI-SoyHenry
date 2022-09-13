const { Router } = require('express');
const morgan = require('morgan')
const { route } = require('../app');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const recipeRouter = require("./recipeRoutes")
const dietRouter = require('./dietRoutes')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use(morgan('tiny'))
router.use('/recipes', recipeRouter)
router.use('/diets', dietRouter)

module.exports = router;
