const {Op, Diet, Recipe} = require('../db')
const { Router } = require('express');
const {getDiets,getRecipeByDiet} = require("../utils/utilsRoutes")
const router = Router();

router.get("/", async (req, res) => {
    try {
        const dietas = await getDiets()
        res.status(200).json(dietas)
    } catch (error) {
        res.status(400).send("Hubo un error: "+error.message)
    }
})

router.get("/:dietName", async (req, res) => {
    const diet = req.params.dietName
    if(diet){
        try {
            const resultado = await getRecipeByDiet(diet)
            console.log(resultado)
            res.status(201).send(resultado)
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
    else{
        res.status(400).send("No proporciono una dieta")
    }
    
})


module.exports = router