//Funcion que agrega la D a al id
const idGeneratorDB = (id) => {
    
    return "D"+id
}
//Todas las dietas que existen
const dietTypes = ['vegan', 'vegetarian', 'gluten free', 
'dairy free', 'very healthy', 'cheap', 'ketogenic', 'lowFodmap', 
'whole 30', 'paleolithic', 'primal', 'lacto ovo vegetarian']



module.exports = {
    idGeneratorDB,
    dietTypes,
}

