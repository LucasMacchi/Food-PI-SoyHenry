

const initialState = {
    recipes: [],
    recipeDetail: {},
    dietTypes: ['Vegan', 'Vegetarian', 'Gluten Free', 
    'Dairy Free', 'Very Healthy', 'cheap', 'Ketogenic', 'LowFodmap', 
    'Whole30', 'Paleolithic', 'Primal', 'Lacto-Vegetarian', 'Ovo-Vegetarian'],
    filteredRecipes: []
}

const rootReducer = (state = initialState, action) => {
    switch(action.type){
        case "GET_ALL_RECIPES":
            return{
                ...state,
                recipes: state.recipes.concat(action.payload)
            }
        case "GET_RECIPE_DETAIL":
            return{
                ...state,
                recipeDetail: action.payload
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
        case "UPDATE_RECIPE_DIET":
            return{
                ...state,
                recipes: state.recipes.concat(action.payload)
            }
        default:
            return {...state}
    }
}
export default rootReducer;