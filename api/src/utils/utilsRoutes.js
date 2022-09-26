const {dietTypes} = require('../utils/utilsModels')
const { QueryTypes, Sequelize } = require('sequelize');
const {Op, Diet, Recipe} = require('../db')
const {API_KEY} = process.env
const {db, conn} = require('../db');
const noImage = "https://img.icons8.com/ios/500/no-image.png"
const RECETAS_API_SIMPLE = "https://api.spoonacular.com/recipes/complexSearch?apiKey="+API_KEY+"&addRecipeInformation=true&number=100"
//const RECETAS_API_SIMPLE = "https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5"
//El Simplifier lo que hace es traer los datos de la api de la forma mas limpia y estadarizada posible, entonces es mas facil de navegar sus datos
const simplifier = (recipe) => {
    if(recipe.vegetarian) recipe.diets = recipe.diets.concat("vegetarian")
    if(recipe.veryHealthy) recipe.diets = recipe.diets.concat("very healthy")
    if(recipe.cheap) recipe.diets = recipe.diets.concat("cheap")
    if(recipe.lowFodmap) recipe.diets = recipe.diets.concat("lowFodmap")
    const simpleRecipe = {
        id: recipe.id,
        name: recipe.title,
        resumen: recipe.summary.split("<b>").join(" ").split("</b>").join(" ").split("<a href=").join("\n").split("</a>").join("\n").split(">").join("\n"),
        healthScore: recipe.healthScore,
        image: recipe.image,
        steps: recipe.analyzedInstructions[0]?.steps.map(steps => steps.step).join("\n").split(".").join("\n"),
        diets: recipe.diets
    }
    return simpleRecipe
    
}
//Lo mismo aplica para las recetas de la base de datos
const simplifierDB = recipe => {
    const simpleRecipe = {
        id: recipe.id,
        name: recipe.name,
        resumen: recipe.resumen,
        steps: recipe.steps,
        healthScore: recipe.healthScore,
        image: recipe.image ? recipe.image : noImage,
        diets: recipe.diets.map(rep => rep.name)
    }
    return simpleRecipe
}

//Este trae todas la recetas que se encuentran en la base de datos
const getAllRecipesDB = async () =>{
    try {
        let recipeInDB = await Recipe.findAll({include: "diets"}) 
        recipeInDB = recipeInDB.map(rep => simplifierDB(rep))
        return recipeInDB
    } catch (error) {
        throw new Error("Ocurrio un error: "+error.message) 
    }
   

}
//Este trae todas las recetas, incluyendo las de la base de datos y las de la api, Notese que cada vez q traigo los datos uso el simplifier
const getAllRecipes = async () => {
    let recipeInDB = await Recipe.findAll({include: "diets"})
    recipeInDB = recipeInDB.map(rep => simplifierDB(rep))

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

//Trae todas las recetas que en su titulo tenga un string especifico
const getRecipeByName = async (recipe) => {
    const recipeInDB = await Recipe.findAll({where: {
        name:{
            [Op.like]: '%'+recipe.toLowerCase()+'%' //Esta validacion trae las recetas en donde coincidan el conjunto de letras 
        }
    }})
    try {
        //Aqui lo que hago es una request a la api,
        //este me traera las recetas, lo hare json, filtrare los que tengan el string correspondiente en su titulo
        const allRecepies = await fetch(RECETAS_API_SIMPLE)
        let data = await allRecepies.json()
        data = data.results.filter(rep => {
            if(rep.title.toLowerCase().includes(recipe.toLowerCase())) return rep
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
//Este trae las recetas por ID, primero busca en la base de datos, si existe ahi ya lo retorna, sino sigue buscando
const getRecipeById = async (idToCheck) => {
    let recipeInDB = await Recipe.findOne({where: {id: idToCheck}, include: "diets"})
    
    if(recipeInDB) recipeInDB = simplifierDB(recipeInDB)
    
    
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
//Este crea una nueva receta y la agrega a la base de datos
const postRecipe = async (body) => {
    
    const {id, name, resumen, healthScore, steps, image, diets} = body
    if(id && name && resumen){
        try {
            let dietsArray = await Diet.findAll({where: {name: diets}}) //Creo un array con todos las dietas que coincidan con las dietas que quiero conectar
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
//Este trae todas las dietas, simple
const getDiets = async () => {
    const allDiets = await Diet.findAll()
    return allDiets
}
//Este me trae todas las recetas que tenga la dieta relacionada, lo hago con query porque nose hacerlo con las funciones de sequelize
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
//Este me trae todas las recetas que tengan un numero especifico de healthScore, al final no lo use
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
//Este actualiza la receta
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
            console.log(body)
            await Recipe.update({
            name: name ? name : receta.name,
            resumen: resumen  ? resumen : receta.resumen,
            healthScore: healthScore  ? healthScore : receta.healthScore,
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
//Este elimina la receta
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
            //Chequeo si sigue existiendo, si es asi, tiro un error
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
//Este me deja agregar una dieta mas a una de nuestra recetas
const updateDietInRecipe = async (body) => {
    const {recId, diet} = body
    console.log(recId, diet)
    if(recId && diet){
        const recipe = await Recipe.findByPk(recId)
        const dietToAdd = await Diet.findOne({where: {name: diet}})
        const aux = await recipe.countDiets()
        recipe.addDiet(await dietToAdd)
        //Si la cantidad de recetas no cambio, hubo un error al agregar
        if(aux >= recipe.countDiets()){
            throw new Error("Hubo un error durante la operacion de agregar la dieta")
        }
        return "La dieta se añadio correctamente"
    }
    else{
        throw new Error("Los datos ingresados son insuficientes")
    }
}
//Este elimina una dieta en una receta, se controla igual que el de arriba
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
    getAllRecipes,
    getAllRecipesDB


}