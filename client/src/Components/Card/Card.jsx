import React, { Component, useEffect } from "react";
//redux
import {useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import * as actions from "../../Redux/actions"
import "../../Styles/Card.css"




export default function Card(receta){
    const dispatch = useDispatch()
    useEffect(() => {
    }, [])
    const width = 150
    const height = 150

    //Esta funcion se encarga de eliminar la receta, requiere una confirmacion

    const clickActionDelete = () => {
        if(window.confirm("Estas seguro que quiere eliminar la receta?")){
            dispatch(actions.deleteRecipe(receta.id))
            alert("Se a eliminado la receta "+receta.name)
            window.location.reload(false)
        }
    }
    //Este se encarga de Redireccionar a los detalles de la receta cuando se le hace click a la "carta"
    const shower = () => {
        if(receta.id !== undefined && receta.id[0] === "D"){
            return(
                <div>
                    <Link to={"/Modificar/"+receta.id}>
                            <button id="Card_mod">Modificar</button>
                        </Link>
                        <button id="Card_delete" onClick={() => clickActionDelete()}>Eliminar</button>
                </div>
            )
        }
        else{
            <div>
                <p>La receta no es tuya</p>
            </div>
        }
        
    }

    return(
        <div className="div_Card">
            <div>
                <Link id="link" to={"/Receta/"+receta.id}>
                    
                    <p>{receta.name}</p>
                    <img id="imagenDetail" src={receta.image} width={width} height={height} />
                </Link>
                <div >
                    <p >Health Score: {receta.healthScore}</p>
                    <p >ID: {receta.id}</p>
                </div>
                {shower()}
            </div>
        </div>
    )


}