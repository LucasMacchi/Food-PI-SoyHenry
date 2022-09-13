
const idGeneratorDB = (id) => {
    
    return "D"+id
}

const dietTypes = ['Vegan', 'Vegetarian', 'Gluten Free', 
'Dairy Free', 'Very Healthy', 'cheap', 'Ketogenic', 'LowFodmap', 
'Whole30', 'Paleolithic', 'Primal', 'Lacto-Vegetarian', 'Ovo-Vegetarian']



module.exports = {
    idGeneratorDB,
    dietTypes,
}

