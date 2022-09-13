import React, { Component } from "react";
import "../../Styles/Welcome.css"

export default class Welcome extends Component{
    render(){
        return(
            <div id="welcome">
                <h1 className="titulo">Bienvenido!</h1>
                <p className="texto_welcome">En esta pagina Web tendran recetas de todo tipo y faciles de hacer</p>
                <p className="texto_welcome">Podran ver las recetas en la seccion de "Receas"</p>
                <p className="texto_welcome">Agregaran una receta en "Agregar recetas"</p>
                <p className="texto_welcome">Modificaran las recetas que ustedes hayan agregado</p>
                <p className="texto_welcome">Todo esto con una interfaz facil, rapida y completa</p>
                <p className="texto_welcome">Disfruten!</p>
            </div>
        )
    }
}

/*
En esta pagina Web tendran recetas de todo tipo y faciles de hacer
Podran ver las recetas en la seccion de "Receas"
Agregaran una receta en "Agregar recetas"
Modificaran las recetas que ustedes hayan agregado
Todo esto con una interfaz facil, rapida y completa
Disfruten!
*/
/*
  padding-bottom: 10pc;
    padding-top: 10pc;
    */