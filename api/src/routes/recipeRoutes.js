const {Op, Diet, Recipe} = require('../db')
const { Router } = require('express');
const { getRecipeById,
        getRecipeByName, postRecipe, getRecipeByHealthScore, updateRecipe, 
        deleteRecipe,updateDietInRecipe,deleteDietInRecipe, getAllRecipes} = require('../utils/utilsRoutes');
const { route } = require('.');
const router = Router();


router.get("/", async (req, res) => {
    const name = req.query.name
    const hscore = req.query.hs
    if(name){
        try {
            const response = await getRecipeByName(name)
            res.status(200).send(await response)
        } catch (error) {
            res.status(404).send(error.message)
        }
    }
    if(hscore){
        try {
            
            const response = await getRecipeByHealthScore(hscore)
            res.status(200).send(await response)
        } catch (error) {
            res.status(404).send(error.message)
        }
    }
    
})

router.get("/all", async (req, res) => {
    try {
        const response = await getAllRecipes()
        res.status(200).send(await response)
    } catch (error) {
        res.status(404).send(error.message)
    }
})

router.post("/", async (req, res) => {
    try {
        const resultado = await postRecipe(req.body)
        console.log(resultado)
        res.status(200).send(resultado)
    } catch (error) {
        res.status(400).send(error.message)
    }
})



router.get("/:idReceta", async (req, res) => {
    const idReceta = req.params.idReceta

    const resultado = await getRecipeById(idReceta)
    if(typeof resultado === "string") res.status(404).json(resultado)
    else{
        res.status(200).json(resultado)
    }
})

router.put("/update/:id", async (req, res) => {
    const idReceta = req.params.id
    const body = req.body
    try {
        const response = updateRecipe(idReceta, body)
        res.status(200).send(await response)
    } catch (error) {
        res.status(404).send(error.message)
    }
})

router.delete("/delete/:id", async (req, res) => {
    const idReceta = req.params.id
    try {
        const response = await deleteRecipe(idReceta)
        res.status(200).send(response)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.put("/diet", async (req, res) => {
    const {order} = req.body
    console.log(order)
    if(order === "delete"){
        try {
            const response = await deleteDietInRecipe(req.body)
            res.status(200).send(response)
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
    else{
        try {
            const response = await updateDietInRecipe(req.body)
            res.status(200).send(response)
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
})

module.exports = router