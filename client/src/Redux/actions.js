import axios from "axios"
const GET_ALL_RECIPES = "GET_ALL_RECIPES"
const GET_ALL_RECIPES_FROM_DB = "GET_ALL_RECIPES_FROM_DB"
const GET_RECIPE_DETAIL = "GET_RECIPE_DETAIL"
const GET_RECIPE_BY_NAME = "GET_RECIPE_BY_NAME"
const GET_RECIPE_BY_HS = "GET_RECIPE_BY_HS"
const GET_RECIPE_BY_DIET = "GET_RECIPE_BY_DIET"
const CREATE_RECIPE = "CREATE_RECIPE"
const UPDATE_RECIPE = "UPDATE_RECIPE"
const UPDATE_RECIPE_DIET = "UPDATE_RECIPE_DIET"
const GET_DIETS = "GET_DIETS"

const api = "http://localhost:3001"

export const getAllRecipes = () => {
    return async (dispatch) => {
        try {
            const res = await fetch(api + "/recipes/all")
            const json = await res.json()
            console.log(json)
            dispatch({ type: GET_ALL_RECIPES, payload: json })
        } catch (error) {
            console.log("Error al traer las recetas: "+error.message)
        }
        
    }
}

export const getAllRecipesDB = () => {
    return async (dispatch) => {
        try {
            const res = await fetch(api + "/recipes/allDB")
            const json = await res.json()
            console.log(json)
            dispatch({ type: GET_ALL_RECIPES_FROM_DB, payload: json })
        } catch (error) {
            console.log("Error al traer las recetas: "+error.message)
        }
        
    }
}

export const getRecipeDetail = (id) =>{
    return async (dispatch) => {
        try {
            const res = await fetch(api + "/recipes/"+id)
            const json = await res.json()
            //console.log(json)
            dispatch({ type: GET_RECIPE_DETAIL, payload: json })
        } catch (error) {
            console.log("Error al traer las recetas: "+error.message)
        }
        
    }
}
export const getRecipeByName = (name) =>{
    return async (dispatch) => {
        try {
            const res = await fetch(api + "/recipes?name="+name)
            const json = await res.json()
            console.log(json)
            dispatch({ type: GET_RECIPE_BY_NAME, payload: json })
        } catch (error) {
            console.log("Error al traer las recetas: "+error.message)
        }
        
    }
}
export const getRecipeByHS = (hs) =>{
    return async (dispatch) => {
        try {
            const res = await fetch(api + "/recipes?hs="+hs)
            const json = await res.json()
            console.log(json)
            dispatch({ type: GET_RECIPE_BY_HS, payload: json })
        } catch (error) {
            console.log("Error al traer las recetas: "+error.message)
        }
        
    }
}
export const getRecipeByDiet = (diet) =>{
    return async (dispatch) => {
        try {
            const res = await fetch(api + "/diets/"+diet)
            const json = await res.json()
            console.log(json)
            dispatch({ type: GET_RECIPE_BY_DIET, payload: json })
        } catch (error) {
            console.log("Error al traer las recetas: "+error.message)
        }
        
    }
}
export const create_Recipe = (recipe) =>{
    return async (dispatch) => {
        try {
            const data = JSON.stringify(recipe)
            console.log(data)
            await axios.post(api+"/recipes",recipe)

            dispatch({ type: CREATE_RECIPE, payload: data })
        } catch (error) {
            console.log("Error al crear la receta: "+error.message)
        }
        
    }
}

export const getDiets = () =>{
    return async (dispatch) => {
        try {
            const res = await fetch(api + "/diets")
            const json = await res.json()
            console.log(json)
            dispatch({ type: GET_DIETS, payload: json })
        } catch (error) {
            console.log("Error al traer las dietas: "+error.message)
        }
        
    }
}








