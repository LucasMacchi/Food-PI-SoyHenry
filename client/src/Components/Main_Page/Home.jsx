import React from "react";
import * as actions from "../../Redux/actions"
import Card from "../Card/Card";
import {useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import "../../Styles/Home.css"

const ITEMS_PER_PAGE = 9 //Este numero se encarga de limitar la cantidad de elementos que se pueden mostrar por pagina


export default function Home () {
    const recetas = useSelector(state=> state.recipes)
    const dietTypes = useSelector(state=> state.dietTypes)
    const recetasFiltradas = useSelector(state => state.filteredRecipes)
    const dispatch = useDispatch()
    //Este chequea si ya estan cargados los datos, para no hacerlo de nuevo
    useEffect(() => { 
        if(recetas.length === 0){
            dispatch(actions.getAllRecipes())
        }
        if(dietTypes.length === 0){
            dispatch(actions.getDiets())
        }
        
    }, [])
        //Estados que voy a usar para controlar el flow de la pagina
        const [filtro, setFiltro] = React.useState({filtrado: []})  //Este para guardar cada arreglo que tenga que mostrar
        const [input, setInput] = React.useState({name:""}) //Este guarda el nombre que voy a buscar
        const [order, setOrder] = React.useState({  //Este estado me permite diferenciar el tipo de orden y el payload es el dato que voy a utilizar en la busqueda
            order:"none",
            payload:"none",
            
        })
        const [page, setPage] = React.useState({current: 1,prev: 0, max: filtro.filtrado.length / ITEMS_PER_PAGE})  //Me deja controlar el paginado
        ///////////////////////////////
        useEffect(() => {   //Este actualizara el filtrado cada vez que "recetas" (totas las recetas sin filtrar) se actualice, se usa en caso de ordenamientos
            setFiltro({filtrado: arrayDiveder(recetas)})
            setPage({...page,max: Math.round(recetas.length / ITEMS_PER_PAGE)})
        },[recetas])
        //pasa exactamente los mismo aca
        useEffect(() => {
            setFiltro({filtrado: arrayDiveder(recetasFiltradas)})
            setPage({prev: 0,current: 1,max: Math.round(recetasFiltradas.length / ITEMS_PER_PAGE)})
        },[recetasFiltradas])
        //Este useEffect es super importante, me deja manejar el estado order cada vez que se actualiza, haciendo la logica correspondiente de cada orden
    useEffect(() => {
        console.log("ORDEN = "+order.order+" PAYLOAD = "+order.payload)
        if(order.payload === "none") {
            setFiltro({filtrado: arrayDiveder(recetas)})
            setPage({...page,max: Math.round(recetas.length / ITEMS_PER_PAGE)})
            setOrder({order:"",payload:""}); 
            console.log("RESET")

        }
        else if(order.order === "diet"){
            dispatch(actions.getRecipeByDiet(order.payload))
            console.log("FILTRADO POR DIETA => ",filtro.filtrado)
        }
        else if(order.order ==="ordering" && order.payload === "hs_asc"){
            if(filtro.filtrado.length === recetasFiltradas.length){
                setFiltro({
                    filtrado: arrayDiveder(recetasFiltradas.sort((a,b) => comparadorHS_A(a,b)))
                })
                console.log("FILTRADO POR DIETA Y HS ASC => ",filtro.filtrado)
            }
            else{
                setFiltro({
                    filtrado: arrayDiveder(recetas.sort((a,b) => comparadorHS_A(a,b)))
                })
                console.log("ORDENADO POR HS ASC => ",filtro.filtrado)
            }
            
            
        }
        else if(order.order ==="ordering" && order.payload === "hs_des"){
            if(filtro.filtrado.length === recetasFiltradas.length){
                setFiltro({
                    filtrado: arrayDiveder(recetasFiltradas.sort((a,b) => comparadorHS_D(a,b)))
                })
                console.log("FILTRADO POR DIETA Y HS DES => ",filtro.filtrado)
            }
            else{
                setFiltro({
                    filtrado: arrayDiveder(recetas.sort((a,b) => comparadorHS_D(a,b)))
                })
                console.log("ORDENADO POR HS DES => ",filtro.filtrado)
            }
        }
        else if(order.order ==="ordering" && order.payload === "al_asc"){
            if(filtro.filtrado.length === recetasFiltradas.length){
                setFiltro({
                    filtrado: arrayDiveder(recetasFiltradas.sort((a,b) => comparadorAL_A(a,b)))
                })
                console.log("FILTRADO POR DIETA Y alfabeticamente ASC => ",filtro.filtrado)
            }
            else{
                setFiltro({
                    filtrado: arrayDiveder(recetas.sort((a,b) => comparadorAL_A(a,b)))
                })
                console.log("FILTRADO POR DIETA Y alfabeticamente ASC => ",filtro.filtrado)
            }
        }
        else if(order.order ==="ordering" && order.payload === "al_des"){
            if(filtro.filtrado.length === recetasFiltradas.length){
                setFiltro({
                    filtrado: arrayDiveder(recetasFiltradas.sort((a,b) => comparadorAL_D(a,b)))
                })
                console.log("FILTRADO POR DIETA Y alfabeticamente DES => ",filtro.filtrado)
            }
            else{
                setFiltro({
                    filtrado: arrayDiveder(recetas.sort((a,b) => comparadorAL_D(a,b)))
                })
                console.log("FILTRADO POR DIETA Y alfabeticamente DES => ",filtro.filtrado)
            }
        }
        else if(order.order ==="search"){
            console.log(order.payload)
            dispatch(actions.getRecipeByName(input.name))
            
        }
    },[order])
    //Este me deja que cada vez que se actualiza la pagina, tengo que dividir devuelta el array de recetas para mostrar las siguientes
    //esto depende obviamente si estoy viendo las recestas filtradas o todas las recetas
    useEffect(() => {
        console.log("pagina siguiente")
        if(order.order === "diet") setFiltro({filtrado: arrayDiveder(recetasFiltradas)})
        else if(order.order === "search") setFiltro({filtrado: arrayDiveder(recetasFiltradas)})
        else {
            setFiltro({filtrado: arrayDiveder(recetas)})
        }
        
    },[page])
    //Este me deja resetear la busqueda si no hay nada escrito en el buscador, haciendo que se muestren todas las recetas
    useEffect(() => {
        if(input.name === "") setOrder({...order, payload: "none"})
    },[input])


    //Handlers
    //La logica de cambiar las paginas es ir cambiando el "slice" que se le hace al arreglo de recetas, se usa la pagina acutal multiplicado
    //por la cantidad maxima de elementos para ir cambiando que hasta donde llega el slice y se usa el "prev" que se va sumando o restando 
    //la cantidad maxima de elementos, esto me daria de donde empieza el slice del arreglo de recetas, todo esto me da una logica para ir moviendote 
    //por un arreglo mientras solo mostrar los elementos de a 9 o de otro numero
    const nextPage = () => {
        setPage({...page,current: page.current+1, prev: page.prev+ITEMS_PER_PAGE})
        
    }
    const prevPage = () => {
        setPage({...page,current: page.current-1, prev: page.prev-ITEMS_PER_PAGE})
    }
    const arrayDiveder = (array) => {
        console.log(page.prev,page.current*ITEMS_PER_PAGE)
        const newArray = array.slice(page.prev,page.current*ITEMS_PER_PAGE)
        console.log("array = ",newArray)
        return newArray
    }
    const handleDiet = (e) => {
        setOrder({order: "diet",payload: e.target.value})
    }
    const handleOrdering = (e) => {
        setOrder({order: "ordering",payload: e})
    }
    //Estos se usaran dentro del "sort" del arreglo de recetas para ordenar dependiendo de la orden enviada
    const comparadorHS_A = (a, b) => {
        if(a.healthScore == b.healthScore) return 0
        if(a.healthScore < b.healthScore) return -1
        return 1
    }
    const comparadorHS_D = (a, b) => {
        if(a.healthScore == b.healthScore) return 0
        if(a.healthScore > b.healthScore) return -1
        return 1
    }
    const comparadorAL_A = (a, b) => {
        a = a.name.toLowerCase()
        b = b.name.toLowerCase()
        return a.localeCompare(b)
    }
    const comparadorAL_D = (a, b) => {
        a = a.name.toLowerCase()
        b = b.name.toLowerCase()
        return b.localeCompare(a)
    }
    //Maneja el input del nombre
    const formsHandler = (e) => {
        e.preventDefault()
        setOrder({order: "search",payload: input.name})
        
    }
    const handleName = (e) => {
        setInput({name: e.target.value})
    }
    //Components creators
    const createCardsFiltered = () => {
        return filtro.filtrado.map((rep) =>  {
            //console.log(rep.id)
            return(
                <Card id={rep.id} name={rep.name} image={rep.image} healthScore={rep.healthScore}/> 
            )
        });
        
    }
    const createOptions = () => {
        //console.log(dietTypes)
        return dietTypes.map( (dietT) => {
            return(
                <option value={dietT.name}>{dietT.name}</option>
            )
        })
    }

    return(
        <div id="homeDiv">
            <header id="headerHome">
                <div>
                    <label htmlFor="">Dieta: </label>
                    <select value={order.payload} onChange={e => handleDiet(e)}>
                        <option value="none">...</option>
                        {createOptions()}
                    </select>
                    <button value={"none"} onClick={(e) => handleDiet(e)} >Resetear</button>
                </div>
                <div>
                    <label htmlFor="">Ordenar Por:</label>
                    <button onClick={() => handleOrdering("hs_asc")} >Health Score Ascendente</button>
                    <button onClick={() => handleOrdering("hs_des")} >Health Score Descendiente</button>
                    <button onClick={() => handleOrdering("al_asc")} >Alfabetico Ascendente</button>
                    <button onClick={() => handleOrdering("al_des")} >Alfabetico Descendiente</button>
                </div>
                <div>
                    <form onSubmit={(e) => formsHandler(e)}>
                        <label for="">Ingrese el nombre:</label>
                        <input type="text" name="name" autoComplete="off" value={input.name} onChange={e => handleName(e)} />
                        {input.name ? <button type="submit">Buscar</button> : <button type="submit" disabled>Buscar</button>}
                    </form>
                </div>
            </header>
            <div>
                {createCardsFiltered() }
            </div>
            <div id="paginadoHome">
                {/**Estos botones estan condicionados para no tener logica y no poder seguir o retorceder en caso de que no haya nada mas atras o adelante */}
                {page.current === 1 ? <button disabled>{"<"}</button> : <button onClick={() => prevPage()}>{"<"}</button>}
                <p>{page.current+" de "+page.max}</p>
                {page.current === page.max ? <button disabled>{">"}</button> : <button  onClick={() => nextPage()}>{">"}</button>}
            </div>

        </div>
    )
}









