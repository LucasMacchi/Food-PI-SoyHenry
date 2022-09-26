import './App.css';
import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import background from "./images/image_background.jpg"
import Home from "./Components/Main_Page/Home.jsx"
import Cabeza from "./Components/Others/Cabeza.jsx"
import Nav from "./Components/Nav/Nav.jsx"
import Footer from "./Components/Others/Footer"
import Welcome from "./Components/Welcome_Page/Welcome.jsx"
import AddRecipe from "./Components/Add_rec/AddRecipe.jsx"
import ModRecipe from './Components/Modified_rec/ModRecipe';
import Detail from './Components/Detail/Detail';
import OwnRecipes from './Components/Modified_rec/OwnRecipes';
import About from "./Components/Others/About"



function App() {
  return (
    <div style={{ backgroundImage: `url(${background})` }}>
        <React.Fragment >
          <Cabeza/>
          <Nav/>
          <Route index exact path="/" component={Welcome}/>
          <Route exact path="/Recetas" component={Home}/>
          <Route exact path="/Agregar" component={AddRecipe}/>
          <Route exact path="/Tus_recetas" component={OwnRecipes}/>
          <Route exact path="/Modificar/:id" component={ModRecipe}/>
          <Route exact path="/About" component={About}/>
          <Route path = "/Receta/:id" component={Detail}/>
          <Route path="*" render={() => <Redirect to="/"/>}/>
          <Footer/>
      </React.Fragment>
    </div>
    
  );
}

export default App;
