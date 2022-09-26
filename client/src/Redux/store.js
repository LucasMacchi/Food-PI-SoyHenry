import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducer";
import thunk from "redux-thunk";

const store = createStore(
    rootReducer, 
    compose(
        applyMiddleware(thunk), //Este me deja manejar procesos asincronicos
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //me deja usar la extension del navegador
    )
        
)    
    


export default store;