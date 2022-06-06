/* Teemu Leinonen */
import { config } from './components/config';
const createURL = require('./createURL');

test('search only with ingredients', () => {
  let searchIngredients = createURL(['tomato', 'chili'], null, []);
  let searchIngredientsExpect = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=tomato,+chili&fillIngredients=true&addRecipeInformation&addRecipeNutrition=true&number=100&apiKey=${config.apiKey}`;
  expect(searchIngredients).toBe(searchIngredientsExpect);
})
test('search only with diet', () => {
  let searchDiet = createURL([], 'vegan', []);
  let searchDietExpect = `https://api.spoonacular.com/recipes/complexSearch?diet=vegan&fillIngredients=true&addRecipeInformation&addRecipeNutrition=true&number=100&apiKey=${config.apiKey}`;
  expect(searchDiet).toBe(searchDietExpect);
})
test('search only with intolerances', () => {
  let searchIntolerances = createURL([], null, ['shellfish', 'peanut']);
  let searchIntolerancesExpect = `https://api.spoonacular.com/recipes/complexSearch?intolerances=shellfish,peanut&fillIngredients=true&addRecipeInformation&addRecipeNutrition=true&number=100&apiKey=${config.apiKey}`;
  expect(searchIntolerances).toBe(searchIntolerancesExpect);
})
test('search with all options', () => {
  let searchAll = createURL(['tomato', 'chili'], 'vegan', ['shellfish', 'peanut']);
  let searchAllExpect = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=tomato,+chili&intolerances=shellfish,peanut&diet=vegan&fillIngredients=true&addRecipeInformation&addRecipeNutrition=true&number=100&apiKey=${config.apiKey}`;
  expect(searchAll).toBe(searchAllExpect);
})
test('search with all options empty', () => {
  let searchEmpty = createURL([], null, []);
  expect(searchEmpty).toBe('search conditions empty');
})
