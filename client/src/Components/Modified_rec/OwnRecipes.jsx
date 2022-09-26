import React, { useEffect } from "react";
//redux
import {useDispatch, useSelector } from "react-redux";

import * as actions from "../../Redux/actions"
import Card from "../Card/Card";
import "../../Styles/OwnRecipes.css"

export default function OwnRecipes (){
    const dispatch = useDispatch()
    const recetasDB = useSelector(state => state.filteredRecipes)
    //Traigo todos los datos cuando se monta el componente
    useEffect(() => {
        try {
            dispatch(actions.getDiets())
            dispatch(actions.getAllRecipesDB())
        } catch (error) {
            alert("Ocurrio un error cargando los datos: "+error.message)
        }
        
    }, [])
    console.log(recetasDB)
    //Crea cartas con los componentes creados por el usuario
    const createCards = () => {
        return recetasDB.map((rep) =>  {
            //console.log(rep.id)
            return(
                <Card id={rep.id} name={rep.name} image={rep.image} healthScore={rep.healthScore}/> 
            )
        });
    }

    return(
        <div className="div_ownrecipes">
            {createCards()}
        </div>
    )


}