import React, { Component, useEffect } from "react";
//redux
import {useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as actions from "../../Redux/actions"
import "../../Styles/ModRecipe.css"



export function validate(input){
    let errors = {}
        if(/[.!@#$%^&*()_+-=]/.test(input.name)){
            errors.name = "Nombre no puede tener caracteres especiales"
        }
        if(!/[0-9]/.test(input.healthScore)){
            errors.healthScore = "Puntaje de Salud tiene que ser un numero"
        }else if(parseInt(input.healthScore) > 100){
            errors.healthScore = "Tiene que ser menor que 100"
        }else if(parseInt(input.healthScore) < 1){
            errors.healthScore = "Tiene que ser 1 o mas "
        }
        return errors
}

export default function ModRecipe(props) {
    const receta = useSelector(state => state.recipeDetail)
    const dietTypes = useSelector(state => state.dietTypes)
    const parametroID = props.match.params.id
    const history = useHistory()
    const dispatch = useDispatch()
    
    

    const [input, setInput] = React.useState({
        name: "",
        resumen: "",
        healthScore: "",
        steps: "",
        image: "",

    })

    const [detail, setDetail] = React.useState({
        name: "",
        resumen: "",
        healthScore: "",
        steps: "",
        diets: [],
        image: "",
    })

    const [type, setType] = React.useState({type:""})
    const [errors, setErrors] = React.useState({});
    const [diet, setDiet] = React.useState({diet:""})

    useEffect(() => {
        dispatch(actions.getRecipeDetail(parametroID))
        dispatch(actions.getDiets())
    },[])

    useEffect(() => {
        console.log(receta)
        setDetail({
            name: receta.name,
            resumen: receta.resumen,
            healthScore: receta.healthScore,
            steps: receta.steps,
            diets: receta.diets,
            image: receta.image,
        })
    },[receta])

    const handleChange = (e) => {

        setInput({
            ...input,

            [e.target.name]: e.target.value
          })
          //console.log(input)
          setErrors(validate({
            ...input,
            [e.target.name]: e.target.value
          }));
    }

    const handleSubmit = (e) => {
        try {
            e.preventDefault()
            console.log(receta.id)
            dispatch(actions.updateRecipe(parametroID,input))
            alert("Receta actualizada")
            history.push("/Tus_recetas")
        } catch (error) {
            alert("Ocurrio un Error: "+error.message)
        }
        

    }

    const handleType = (e) =>{
        setType({type:e.target.value})
        
    }

    const handleDiet = (e) => {
        setDiet({diet: e.target.value})
        console.log(type.type)
    }
    const handleSubmitDiet = () => {
        try {
            const body = {
                recId: parametroID,
                order:type.type,
                diet:diet.diet
            }
            dispatch(actions.addDiet(body))
            alert("Se modifico las dietas de la receta")
            dispatch(actions.getRecipeDetail(parametroID))
        } catch (error) {
            alert("Ocurrio un Error: "+error.message)
        }
        

    }

    const createOptions = () => {
        //console.log(dietTypes)
        return dietTypes.map( (dietT) => {
            return(
                <option value={dietT.name}>{dietT.name}</option>
            )
        })
    }

    const createDiets = () => {
        return detail.diets?.map( diet => {
            return(
            <li>{diet}</li>
            )
        })
    }


    //-------------------------------------------------------------------------------------------------------//
    return(
        <div id="modDiv">
            <div id="modFormDiv" className="modComDiv">
                <h2>Ingrese los datos a Cambiar!</h2>
                <form id="UpdateForm" onSubmit={ e => handleSubmit(e)}>
                    <div className="updateRecipe_label">
                        <label>Nombre: </label>
                        <input type="text" name="name" autoComplete="off" value={input.name} onChange={e => handleChange(e)} />
                    </div>
                    {errors.name && <p className="danger">{errors.name}</p>}
                    <div className="updateRecipe_label">
                        <label>Resumen: </label>
                        <input type="text" name="resumen" autoComplete="off" value={input.resumen} onChange={e => handleChange(e)} />
                    </div>
                    {errors.resumen && <p className="danger">{errors.resumen}</p>}
                    <div className="updateRecipe_label">
                        <label>Puntaje de Salud: </label>
                        <input type="text" name="healthScore" autoComplete="off" value={input.healthScore} onChange={e => handleChange(e)} />
                    </div>
                    {errors.healthScore && <p className="danger">{"\n"+errors.healthScore}</p>}
                    <div className="updateRecipe_label">
                        <label>Paso a Paso: </label>
                        <input type="text" name="steps" autoComplete="off" value={input.steps} onChange={e => handleChange(e)} />
                    </div>
                    <div className="updateRecipe_label">
                        <label>Imagen (URL): </label>
                        <input type="text" name="image" autoComplete="off" value={input.image} onChange={e => handleChange(e)} />
                    </div>
                    <div>
                        {!errors.name ? <button id="Boton_AddRecipe" type="submit">Agregar</button> : <button id="Boton_AddRecipe" type="submit" disabled>Agregar</button>}
                    </div>
                </form>
            </div>
            <div id="modDietDiv" className="modComDiv">
                <h2>Modifica las dietas de la Receta</h2>
                <p>Elija la accion</p>
                <select value={type.type} onChange={ e => handleType(e)}>
                    <option value="delete">Eliminar</option>
                    <option value="add">Añadir</option>
                </select>
                <p>Elija la dieta</p>
                <select value={diet.diet} onChange={e => handleDiet(e)}>
                    {createOptions()}
                </select>
                <button id="updateDiet_btn" onClick={ () => handleSubmitDiet()}>Hecho</button>
            </div>
            <div id="modDetailDiv" className="modComDiv">
                <h2>{detail?.name}</h2>
                <h2>Resumen</h2>
                <p>{detail?.resumen}</p>
                <h2>Paso a Paso</h2>
                <p>{detail?.steps}</p>
                <p>Health Score: {detail?.healthScore}</p>
                <h2>Dietas</h2>
                <ul></ul>
                {createDiets()}
                <img src={detail?.image} alt=""/>
            </div>
        </div>
    )

}
