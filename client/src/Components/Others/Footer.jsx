import image from "../../images/cooking.png"
import React, { Component } from "react";
import "../../Styles/Footer.css"
const github = "https://github.com/LucasMacchi"
const LinkedIn = "https://www.linkedin.com/in/lucas-macchi-a02956233/"



export default class Footer extends Component{
    render(){
        return(
            <div id="footer_div">
                <footer className="footer">
                    <div>
                        <ul className="Footerlist">
                            <li className="item">Hecho por Lucas Macchi</li>
                            <li className="item">Correo: lucasmacchi25@gmail.com</li>
                            <li className="item">GitHub: <a className="item" href={github}>{github}</a></li>
                            <li className="item">LinkedIn: <a className="item" href={LinkedIn}>{LinkedIn}</a></li></ul>
                    </div>
                    <div>
                        <img src={image} alt="" width="100" heigth="100"/>
                    </div>
                </footer>
            </div>
        )
    }
}

/*
<ul className="Footerlist">
<li className="item">Hecho por Lucas Macchi</li>
<li className="item">Correo: lucasmacchi25@gmail.com</li>
<li className="item">GitHub: <a className="item" href={github}>{github}</a></li>
<li className="item">LinkedIn: <a className="item" href={LinkedIn}>{LinkedIn}</a></li></ul>
<img src={image} alt="" width="100" heigth="100"/>
*/