/* Teemu Leinonen */
import { config } from "./components/config";

function createURL(ingredients, selectedDiet, selectedIntolerances) {
    if (ingredients.length > 0 || selectedDiet || selectedIntolerances.length > 0) {
        let url_query = '';
        if (ingredients.length > 0) {
            url_query += `includeIngredients=${ingredients[0]}`;
            for (let i = 1; i < ingredients.length; i++) {
                url_query += ',+' + ingredients[i];
            }
        }
        if (selectedIntolerances. length > 0) {
            url_query += ingredients.length !== 0 ? `&intolerances=${selectedIntolerances[0]}` : `intolerances=${selectedIntolerances[0]}`;
            for (let n = 1; n < selectedIntolerances.length; n++) {
                url_query += ',' + selectedIntolerances[n];
            }
        }
        selectedDiet 
        ? url_query += ingredients.length !== 0 && selectedIntolerances.length !== 0 ? `&diet=${selectedDiet}` : `diet=${selectedDiet}`
        : null;
        let url = `https://api.spoonacular.com/recipes/complexSearch?${url_query}&fillIngredients=true&addRecipeInformation&addRecipeNutrition=true&number=100&apiKey=${config.apiKey}`;
        return url;
    } else {
        return 'search conditions empty'        
    }
}
module.exports = createURL;