import React, { Component, useEffect } from "react";
//redux
import {useDispatch, useSelector } from "react-redux";
import * as actions from "../../Redux/actions"
import "../../Styles/AddRecipe.css"

export function validate(input, recetas){
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
        if(!/[0-9]/.test(input.id)){
            errors.id = "ID tiene que ser un numero"
        }
        else if(recetas.find( rec => rec.id === "D"+input.id)){
            console.log("ERROR")
            errors.id = "ID ya existente"
        }
        return errors
}

export default function AddRecipe() {
    const recetas = useSelector(state => state.filteredRecipes)

    const dietTypes = useSelector(state => state.dietTypes)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(actions.getAllRecipesDB())
        dispatch(actions.getDiets())
        console.log(">")
    }, [])

    const [input, setInput] = React.useState({
        id: 1,
        name: "",
        resumen: "",
        healthScore: 1,
        steps: "",
        image: "",
        diets: []
    })
    const [errors, setErrors] = React.useState({});

    const handleChangeArray = (e) =>{
        let newDiet = e.target.value 
        let diets = new Set([...input.diets])
        if(!diets.has(newDiet)){
            diets.add(newDiet)
        }else{
            diets.delete(newDiet)
        }
        diets = Array.from(diets)
        setInput({
            ...input,
            diets
        })
        
    }

    const handleChange = (e) => {

        setInput({
            ...input,

            [e.target.name]: e.target.value
          })
          console.log(input)
          setErrors(validate({
            ...input,
            [e.target.name]: e.target.value
          }, recetas));
          
    }

    const handleSubmit = (e) => {
        console.log(input)
        dispatch(actions.create_Recipe(input))
        alert("Receta Agregada")
        
    }

    const createOptions = () => {
        return dietTypes.map( (diet) => {
            return(
                <div>
                    <label htmlFor={diet.name}>{diet.name}</label>,
                    <input type="checkbox" value={diet.name} name={diet.name} autoComplete="off" onChange={e => handleChangeArray(e)} />
                </div>
                
            )
        })
    }

    //----------------------------
    return(
        <div id="div_addForm">
                <span id="tituloAddForm">Agrega una Receta!</span>
                <form id="formAdd" action="" onSubmit={ e => handleSubmit(e)}>
                <div className="addRecipe_label">
                        <label>ID*: </label>
                        <input type="text" name="id" autoComplete="off" value={input.id} onChange={e => handleChange(e)} />
                    </div>
                    {errors.id && <p className="danger">{errors.id}</p>}
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
                        <p>Selecciona las dietas</p>
                        {createOptions()}

                    </div>
                    <div>
                        {!errors.name && !errors.resumen && input.name.length > 0 && input.resumen.length > 0 ? <button id="Boton_AddRecipe" type="submit">Agregar</button> : <button id="Boton_AddRecipe" type="submit" disabled>Agregar</button>}
                    </div>
                </form>
            </div>
    )

}
