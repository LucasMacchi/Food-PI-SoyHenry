import React, { Component, useEffect } from "react";
//redux
import {useDispatch, useSelector } from "react-redux";
import * as actions from "../../Redux/actions"
import "../../Styles/Detail.css"



export default function Detail(props){

    const receta = useSelector(state => state.recipeDetail)
    const dispatch = useDispatch()
    const id = props.match.params.id

    useEffect(() => {
        dispatch(actions.getRecipeDetail(id))
        
    },[])

    const width = 400
    const height = 400



    const getList = () =>{
        return receta.diets?.map(diet => {
            return(
                <p>{diet}</p>
            )
        })
    }

    return(
        <div id="div_detail">
            <div id="div_detail_info">
                <h1 className="tituloDE">{receta.name}</h1>
                <p className="tituloDE">Resumen</p>
                <p className="parrafo">{receta.resumen}</p>
                <p className="tituloDE">Pasos</p>
                <p className="parrafo">{receta.steps}</p>
                <p className="tituloDE">Dietas</p>
                {
                    getList()
                }
                <img id="imagenDetail" src={receta.image} width={width} height={height} />
                <div id="div_detail_stats">
                    <p className="tituloDE">Health Score: {receta.healthScore}</p>
                    <p className="tituloDE">ID: {receta.id}</p>
                </div>

            </div>
            
        </div>
    )


} 