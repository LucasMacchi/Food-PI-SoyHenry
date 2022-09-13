

const GET_ALL_RECIPES = "GET_ALL_RECIPES"
const GET_RECIPE_DETAIL = "GET_RECIPE_DETAIL"
const GET_RECIPE_BY_DIET = "GET_RECIPE_BY_DIET"
const CREATE_RECIPE = "CREATE_RECIPE"
const UPDATE_RECIPE = "UPDATE_RECIPE"
const UPDATE_RECIPE_DIET = "UPDATE_RECIPE_DIET"
const api = "http://localhost:3001"

let dbRecipesId = []


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




/*
    try {
        const recipes = await fetch(api+"/recipes/all")
        console.log("aacaaa")
        const data = await recipes.json()
    return{
        type: GET_ALL_RECIPES,
        payload: data
    }
    } catch (error) {
        console.log("Ocurrio un error => "+error.message)
    }

*/





