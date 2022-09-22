import React, { Component } from "react";
import "../../Styles/Cabeza.css"

//#region IMAGENES A UTILIZAR
//const image1 = "https://i.pinimg.com/originals/90/4d/84/904d843d70c0f72fdecde1da0c5deb6b.jpg"
//const image2 = "https://static.vecteezy.com/system/resources/previews/001/919/301/non_2x/continuous-line-drawing-of-food-symbol-sign-of-plate-knife-and-fork-minimalism-hand-drawn-one-line-art-minimalist-illustration-dinner-theme-with-creative-sketch-contour-vector.jpg"
//const width = 175
//const height = 175
//#endregion




export default class Cabeza extends Component{

    render(){
        return(
            <div className="cabeza_div">
                <header className="encabezado">
                    <div className="titulo">
                        <h2 className="tituloMain">El Rincon de la Recetas</h2>
                        <h3 className="desc">Las Mejores Recetas!</h3>
                    </div>
                </header>
            </div>
        )
    }
}