const {dietTypes} = require('../utils/utilsModels')
const { QueryTypes, Sequelize } = require('sequelize');
const {Op, Diet, Recipe} = require('../db')
const {API_KEY} = process.env
const axios = require('axios')
const { response } = require('../app');
const {db, conn} = require('../db');
const { raw } = require('body-parser');
const { all } = require('../routes');
const RECETAS_API_SIMPLE = "https://api.spoonacular.com/recipes/complexSearch?apiKey="+API_KEY+"&addRecipeInformation=true&number=10"
//const RECETAS_API_COMPLEX = "https://api.spoonacular.com/recipes/complexSearch?apiKey="+API_KEY+"&addRecipeInformation=true"
const simplifier = (recipe) => {
    const simpleRecipe = {
        id: recipe.id,
        name: recipe.title,
        resumen: recipe.summary,
        healthScore: recipe.healthScore,
        image: recipe.image,
        steps: recipe.analyzedInstructions[0]?.steps.map(steps => steps.step).join("\n"),
        diets: recipe.diets
    }
    return simpleRecipe
    
}

const getAllRecipes = async () => {
    const recipeInDB = await Recipe.findAll()

    try {
        const allRecepies = await fetch(RECETAS_API_SIMPLE)
        let data = await allRecepies.json()
        data = data.results.map(rep => simplifier(rep))
        if(recipeInDB.length > 0) data = data.concat(recipeInDB)
        return data
    } catch (error) {
        throw new Error("Failed request: "+error.message)
    }
}


const getRecipeByName = async (recipe) => {
    const recipeInDB = await Recipe.findAll({where: {
        name:{
            [Op.like]: '%'+recipe+'%'
        }
    }})
    console.log(await recipeInDB)
    try {
        //Aqui lo que hago es una request a la api,
        //este me traera las recetas, lo hare json, filtrare los que tengan 
        //las letras que coincidan y si se puede, los unire con los de la base de datos
        const allRecepies = await fetch(RECETAS_API_SIMPLE)
        let data = await allRecepies.json()
        data = data.results.filter(rep => {
            if(rep.title.includes(recipe)) return rep
        })
        //console.log(data)
        data = data.map(rep => simplifier(rep))
        if(recipeInDB.length > 0) data = data.concat(recipeInDB)
        if(data.length === 0) throw Error ("No existe ningun plato con ese nombre")
        return data
    } catch (error) {
        throw new Error("Failed request: "+error.message)
    }
}

const getRecipeById = async (idToCheck) => {
    const recipeInDB = await Recipe.findOne({where: {id: idToCheck}, include: Diet})
    
    if(recipeInDB) return recipeInDB
    else{
        
        try {
            const recipeById = await fetch("https://api.spoonacular.com/recipes/"+idToCheck+"/information?apiKey="+API_KEY)
            
            let data = await recipeById.json()
            console.log(data)
            data = simplifier(data)
            if(!data) throw new Error("No existe una receta con ese Id")
            return data
        } catch (error) {
            return "Request had failed: " + error.message
        }
    }
}

const postRecipe = async (body) => {
    
    const {id, name, resumen, healthScore, steps, image, diets} = body
    if(id && name && resumen){
        try {
            let dietsArray = await Diet.findAll({where: {name: diets}})
            //console.log(await dietsArray)
            await Recipe.create({
                id: id,
                name: name,
                resumen: resumen,
                healthScore: healthScore,
                steps:steps,
                image:image,
            }) 
            //Agrego las recetas
            const newRecipe = await Recipe.findByPk("D"+id)
            await newRecipe.addDiets(dietsArray)
            //Si no se agregaron bien las dietas, se elimina la receta
            //Seguramente hay una forma mas eficiente de hacer esto, chequear despues
            if(await newRecipe.countDiets() !== diets.length){
                await Recipe.destroy({where: {id: "D"+id}})
                throw new Error("Hubo un error al agregar las dietas")
            }
            //Si se llego aca todo OK :D
            return "La creacion de la receta fue exitosa"
            
        } catch (error) {
            throw new Error("Request had failed: " + error.message)
        }
    }
    else{
        throw new Error("Los datos mandados son insuficientes o incorrectos")
    }

}

const getDiets = async () => {
    const allDiets = await Diet.findAll()
    return allDiets
}

const getRecipeByDiet = async (diet) => {
    let dietNames = await conn.query(`SELECT r.id,r.name,r.resumen, r.steps, r.healthScore, r.image FROM recipes r JOIN Recipe_Diet rd ON rd.recipeId = r.id JOIN diets d ON d.id = rd.dietId WHERE d.name = "${diet}" ;`,{type: QueryTypes.SELECT})
    //dietID = JSON.stringify(dietID)
    console.log("ID DE LA DIETA: ", dietNames)
    try {
        //Aqui lo que hago es una request a la api, este me traera todos las recetas con ese tipo de dieta
        const allRecepies = await fetch(RECETAS_API_SIMPLE)
        let data = await allRecepies.json()
        data = data.results.map(rep => simplifier(rep))
        data = data.filter(rep => {
            if(rep.diets.includes(diet.toLowerCase())){
                return rep
            }
        })
        if(dietNames.length > 0) data = data.concat(dietNames)
        if(data.length === 0) throw new Error("No hay recetas de ese tipo de dieta")
        return data
    } catch (error) {
        throw new Error("Request had failed: " + error.message)
    }
}

const getRecipeByHealthScore = async (score) => {
    const recipeInDB = await Recipe.findAll({where: {healthScore: score}, raw: true})
    console.log(await recipeInDB)
    try {
        //Aqui lo que hago es una request a la api, este me traera 
        const allRecepies = await fetch(RECETAS_API_SIMPLE)
        let data = await allRecepies.json()
        data = data.results.filter(rep => rep.healthScore == score)
        data = data.map(rep => simplifier(rep))
        if(recipeInDB) data = data.concat(recipeInDB)
        if(data.length === 0) throw new Error("No existe ninguna receta con este score")
        return data
    } catch (error) {
        throw new Error("Failed request: "+error.message)
    }
}

const updateRecipe = async (id, body) => {
    //Buscamos que exista una receta con ese id
    const receta = Recipe.findByPk(id, {raw:true})
    //console.log(await receta)
    if(await receta){
        try {
            //Updateamos la receta
            const name = body.name
            const resumen = body.resumen
            const healthScore = body.healthScore
            const steps = body.steps
            const image = body.image
            await Recipe.update({
            name: name ? name : receta.name,
            resumen: resumen ? resumen : receta.resumen,
            healthScore: healthScore ? healthScore : receta.healthScore,
            steps:steps ? steps : receta.steps,
            image:image ? image : receta.image,
        },{where: {id: id}})
            return "La receta fue actualizada exitosamente!"
        } catch (error) {
            throw new Error("Hubo un error en la actualizacion: "+error.message)
        }
    }
    else{
        //Sino tira error
        throw new Error("La receta ingresada no existe (ID not found)")
    }
}

const deleteRecipe = async (id) => {
    //Busco primero que exista la Receta
    const receta = await Recipe.findByPk(id, {raw:true})
    console.log(await receta)
    if(await receta){
        try {
            //Intento eliminar
            await Recipe.destroy({
                where: {id: id}
            })
            const check = await Recipe.findByPk(id, {raw:true})
            if(await check) throw new Error("La receta no se elimino correctamente")
            return "La receta se elimino exitosamente!"
        } catch (error) {
            throw new Error("Hubo un error en la actualizacion: "+error.message)
        }
    }
    else{
        //Sino tira error
        throw new Error("La receta ingresada no existe (ID not found)")
    }
    
}

const updateDietInRecipe = async (body) => {
    const {recId, diet} = body
    console.log(recId, diet)
    if(recId && diet){
        const recipe = await Recipe.findByPk(recId)
        const dietToAdd = await Diet.findOne({where: {name: diet}})
        const aux = await recipe.countDiets()
        recipe.addDiet(await dietToAdd)
        if(aux >= recipe.countDiets()){
            throw new Error("Hubo un error durante la operacion de agregar la dieta")
        }
        return "La dieta se añadio correctamente"
    }
    else{
        throw new Error("Los datos ingresados son insuficientes")
    }
}
const deleteDietInRecipe = async (body) => {
    const {recId, diet} = body
    console.log(recId, diet)
    if(recId && diet){
        const recipe = await Recipe.findByPk(recId)
        if(await recipe === null) throw new Error("Esta receta no existe")
        const dietToRemove = await Diet.findOne({where: {name: diet}})
        const aux = await recipe.countDiets()
        recipe.removeDiet(await dietToRemove)
        if(aux === await recipe.countDiets()){
            throw new Error("Hubo un error durante la operacion de eliminar la dieta")
        }
        return "La dieta se elimino correctamente"
    }
    else{
        throw new Error("Los datos ingresados son insuficientes")
    }
}


module.exports = {
    getDiets,
    getRecipeByDiet,
    getRecipeById,
    getRecipeByName,
    postRecipe,
    getRecipeByHealthScore,
    updateRecipe,
    deleteRecipe,
    updateDietInRecipe,
    deleteDietInRecipe,
    getAllRecipes


}