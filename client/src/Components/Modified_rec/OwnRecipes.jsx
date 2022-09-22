import React, { Component, useEffect } from "react";
//redux
import {useDispatch, useSelector } from "react-redux";

import * as actions from "../../Redux/actions"
import Card from "../Card/Card";
import "../../Styles/OwnRecipes.css"

export default function OwnRecipes (){
    const dispatch = useDispatch()
    const recetasDB = useSelector(state => state.filteredRecipes)
    useEffect(() => {
        dispatch(actions.getDiets())
        dispatch(actions.getAllRecipesDB())
    }, [])
    console.log(recetasDB)
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