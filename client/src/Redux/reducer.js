

const initialState = {
    recipes: [],
    recipeDetail: {},
    dietTypes: [],
    filteredRecipes: []
}

const rootReducer = (state = initialState, action) => {
    switch(action.type){
        case "GET_ALL_RECIPES":
            return{
                ...state,
                recipes: state.recipes.concat(action.payload)
            }
        case "GET_ALL_RECIPES_FROM_DB":
                return{
                    ...state,
                    filteredRecipes:action.payload
                }
        case "GET_RECIPE_DETAIL":
            return{
                ...state,
                recipeDetail: action.payload
            }
        case "GET_RECIPE_BY_NAME":
            return{
                ...state,
                filteredRecipes:action.payload
            }
        case "GET_RECIPE_BY_HS":
            return{
                ...state,
                filteredRecipes:action.payload
            }
        case "GET_RECIPE_BY_DIET":
            return{
                ...state,
                filteredRecipes:action.payload
            }
        case "CREATE_RECIPE":
            return{
                ...state,
                recipes: state.recipes.concat(action.payload)
            }
        case "UPDATE_RECIPE":
            return{
                ...state,
                recipes: state.recipes.concat(action.payload)
            }
        case "DELETE_RECIPE":
                return{
                    ...state,
                    recipes: state.recipes.filter((rep) => rep.id !== action.payload),
                }
        case "GET_DIETS":
                return{
                    ...state,
                    dietTypes:action.payload
                }
        default:
            return {...state}
    }
}
export default rootReducer;