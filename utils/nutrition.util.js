const Recipe = require('../models/recipe.model');

class NutritionUtil {
  calculateServingNutrition(recipe, servings) {
    const multiplier = servings / recipe.servings;
    return {
      calories: Math.round(recipe.nutrition.calories * multiplier),
      protein: Math.round(recipe.nutrition.protein * multiplier),
      carbs: Math.round(recipe.nutrition.carbs * multiplier),
      fat: Math.round(recipe.nutrition.fat * multiplier)
    };
  }

  async updateNutritionSummary(currentSummary, newRecipeData) {
    const recipe = await Recipe.findById(newRecipeData.recipeId);
    const servingNutrition = this.calculateServingNutrition(recipe, newRecipeData.servings);

    return {
      calories: (currentSummary?.calories || 0) + servingNutrition.calories,
      protein: (currentSummary?.protein || 0) + servingNutrition.protein,
      carbs: (currentSummary?.carbs || 0) + servingNutrition.carbs,
      fat: (currentSummary?.fat || 0) + servingNutrition.fat
    };
  }

  calculateNutritionSummary(recipes) {
    let nutritionSummary = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      vitamins: {}
    };

    recipes.forEach(recipe => {
      if (recipe.nutrition) {
        nutritionSummary.calories += recipe.nutrition.calories || 0;
        nutritionSummary.protein += recipe.nutrition.protein || 0;
        nutritionSummary.carbs += recipe.nutrition.carbs || 0;
        nutritionSummary.fat += recipe.nutrition.fat || 0;
        nutritionSummary.fiber += recipe.nutrition.fiber || 0;

        // Merge vitamins
        for (const [key, value] of Object.entries(recipe.nutrition.vitamins || {})) {
          if (nutritionSummary.vitamins[key]) {
            nutritionSummary.vitamins[key] += value;
          } else {
            nutritionSummary.vitamins[key] = value;
          }
        }
      }
    });

    return nutritionSummary;
  }

  validateNutritionPreferences(summary, preferences) {
    const violations = [];
    
    if (preferences.has('maxCalories') && 
        summary.calories > parseInt(preferences.get('maxCalories'))) {
      violations.push('Exceeds maximum calories');
    }
    
    if (preferences.has('minProtein') && 
        summary.protein < parseInt(preferences.get('minProtein'))) {
      violations.push('Below minimum protein requirement');
    }

    return violations;
  }
}

module.exports = new NutritionUtil();