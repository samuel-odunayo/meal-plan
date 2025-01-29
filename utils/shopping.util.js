const Recipe = require('../models/recipe.model');

class ShoppingUtil {
  async collectIngredients(scheduledRecipes) {
    const ingredientMap = new Map();

    for (const scheduled of scheduledRecipes) {
      const recipe = await Recipe.findById(scheduled.recipeId);
      const multiplier = scheduled.servings / recipe.servings;

      for (const ingredient of recipe.ingredients) {
        const key = `${ingredient.name}-${ingredient.unit}`;
        const currentAmount = ingredientMap.get(key)?.amount || 0;
        
        ingredientMap.set(key, {
          ingredient: {
            name: ingredient.name,
            category: ingredient.category,
            storeSection: this.getStoreSection(ingredient.category)
          },
          amount: currentAmount + (ingredient.amount * multiplier),
          unit: ingredient.unit
        });
      }
    }

    return Array.from(ingredientMap.values());
  }

  async optimizeShoppingList(ingredients) {
    // Sort ingredients by store section for efficient shopping
    return ingredients.sort((a, b) => {
      if (a.ingredient.storeSection === b.ingredient.storeSection) {
        return a.ingredient.name.localeCompare(b.ingredient.name);
      }
      return a.ingredient.storeSection.localeCompare(b.ingredient.storeSection);
    });
  }

  getStoreSection(category) {
    const sectionMap = {
      'vegetables': 'Produce',
      'fruits': 'Produce',
      'meat': 'Meat & Seafood',
      'dairy': 'Dairy',
      'grains': 'Pantry',
      'spices': 'Spices & Seasonings',
      'canned': 'Canned Goods',
      'frozen': 'Frozen Foods'
    };

    return sectionMap[category.toLowerCase()] || 'Other';
  }
}

module.exports = new ShoppingUtil();