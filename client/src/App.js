import './App.css';
import React from 'react';
import {Route} from 'react-router-dom';
import background from "./images/image_background.jpg"
import Home from "./Components/Main_Page/Home.jsx"
import Cabeza from "./Components/Main_Page/Cabeza.jsx"
import Nav from "./Components/Nav/Nav.jsx"
import Footer from "./Components/Main_Page/Footer"
import Welcome from "./Components/Welcome_Page/Welcome.jsx"
import AddRecipe from "./Components/Add_rec/AddRecipe.jsx"

function App() {
  return (
    <div style={{ backgroundImage: `url(${background})` }}>
        <React.Fragment >
          <Cabeza/>
          <Nav/>
          <Route exact path="/" component={Welcome}/>
          <Route exact path="/Agregar" component={AddRecipe}/>
          <Footer/>
      </React.Fragment>
    </div>
    
  );
}

export default App;
