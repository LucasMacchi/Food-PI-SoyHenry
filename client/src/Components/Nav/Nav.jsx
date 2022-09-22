import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import "../../Styles/Nav.css"

export default class Nav extends Component{

    render(){
        return(
            <div className="div">
                <nav className="nav">
                    <NavLink to="/" className="link">
                        <span>Inicio</span>
                    </NavLink>
                    <NavLink to="/Recetas" className="link">
                        <span>Recetas</span>
                    </NavLink>
                    <NavLink to="/Agregar" className="link">
                        <span>Agregar una Receta</span>
                    </NavLink>
                    <NavLink to="/Tus_recetas" className="link">
                        <span>Tus recetas</span>
                    </NavLink>
                    <NavLink to="/About" className="link">
                        <span>Acerca de</span>
                    </NavLink>
                </nav>
            </div>
        )
    }

}


