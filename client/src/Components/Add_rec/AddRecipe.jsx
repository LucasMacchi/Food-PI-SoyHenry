import { send } from "process";
import React, { Component } from "react";
//redux
import {useDispatch, useSelector, useReducer } from "react-redux";
import * as actions from "../../Redux/actions"
import "../../Styles/AddRecipe.css"


export function validate(input){
    let errors = {}
        if(!input.name){
            console.log("Nombre es requerido")
            errors.name = "Nombre es requerido"
        }else if(/[.!@#$%^&*()_+-=]/.test(input.name)){
            errors.name = "Nombre no puede tener caracteres especiales"
        }
        if(!input.resumen){
            errors.resumen = "Resumen es requerido"
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

export default function AddRecipe() {
    const recetas = useSelector(state => state.recipes)
    const dispatch = useDispatch()
    const [input, setInput] = React.useState({
        name: "",
        resumen: "",
        healthScore: 0,
        steps: "",
        image: "" 
    })
    const [errors, setErrors] = React.useState({});
    const [sent, setSent] = React.useState({ok: false})

    const handleChange = (e) => {

        setInput({
            ...input,
            [e.target.name]: e.target.value
          })
        setSent({
           ok:false 
        })
          
          setErrors(validate({
            ...input,
            [e.target.name]: e.target.value
          }));
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSent({ok:true})
        dispatch( actions.getAllRecipes())
        console.log(recetas)
    }

    //----------------------------
    return(
        <div id="div_addForm">
                <span id="tituloAddForm">Agrega una Receta!</span>
                <form action="" onSubmit={ e => handleSubmit(e)}>
                    <div className="addRecipe_label">
                        <label>Nombre*: </label>
                        <input type="text" name="name" autoComplete="off" value={input.name} onChange={e => handleChange(e)} />
                    </div>
                    {errors.name && <p className="danger">{errors.name}</p>}
                    <div className="addRecipe_label">
                        <label>Resumen*: </label>
                        <input type="text" name="resumen" autoComplete="off" value={input.resumen} onChange={e => handleChange(e)} />
                    </div>
                    {errors.resumen && <p className="danger">{errors.resumen}</p>}
                    <div className="addRecipe_label">
                        <label>Puntaje de Salud: </label>
                        <input type="text" name="healthScore" autoComplete="off" value={input.healthScore} onChange={e => handleChange(e)} />
                    </div>
                    {errors.healthScore && <p className="danger">{"\n"+errors.healthScore}</p>}
                    <div className="addRecipe_label">
                        <label>Paso a Paso: </label>
                        <input type="text" name="steps" autoComplete="off" value={input.steps} onChange={e => handleChange(e)} />
                    </div>
                    <div className="addRecipe_label">
                        <label htmlFor="">Imagen (URL): </label>
                        <input type="text" name="image" autoComplete="off" value={input.image} onChange={e => handleChange(e)} />
                        
                    </div>
                    <div>
                        {!errors.name && !errors.resumen && input.name.length > 0 && input.resumen.length > 0 ? <button id="Boton_AddRecipe" type="submit">Agregar</button> : <button id="Boton_AddRecipe" type="submit" disabled>Agregar</button>}
                        <p id="exitoso">{sent.ok && "<-----------Enviado!----------->"}</p>
                    </div>
                </form>
            </div>
    )

}
