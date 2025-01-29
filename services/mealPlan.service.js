const mongoose = require('mongoose');
const MealPlan = require('../models/mealPlan.model');
const Recipe = require('../models/recipe.model');
const ShoppingList = require('../models/shoppingList.model');
const nutritionUtil = require('../utils/nutrition.util');
const shoppingUtil = require('../utils/shopping.util');

class MealPlanService {
  async createMealPlan(mealPlanData) {
    console.log(mealPlanData);
    try {
      const mealPlan = new MealPlan(mealPlanData);
      // await this.validateMealPlan(mealPlanData);
      return await mealPlan.save();
    } catch (error) {
      throw new Error(`Error creating meal plan: ${error.message}`);
    }
  }

  async scheduleRecipe(planId, recipeData) {
    try {
      const mealPlan = await MealPlan.findById(planId);
      if (!mealPlan) throw new Error('Meal plan not found');

      // Validate recipe data
      if (!recipeData.name || !recipeData.ingredients || !recipeData.instructions || !recipeData.servings) {
        throw new Error('Invalid recipe data. Requires name, ingredients, instructions, and servings');
      }

      // Create a new recipe if recipeId is not provided
      let recipe;
      if (!recipeData.recipeId) {
        recipe = new Recipe({
          ...recipeData,
          createdBy: mealPlan.createdBy || new mongoose.Types.ObjectId() // Set a default ObjectId if createdBy is not available
        });
        await recipe.save();
      } else {
        recipe = await Recipe.findById(recipeData.recipeId);
        if (!recipe) throw new Error('Recipe not found');
      }

      // Add recipe to meal plan
      mealPlan.recipes.push({
        recipeId: recipe._id,
        scheduledTime: recipeData.scheduledTime,
        servings: recipeData.servings
      });

      // Update nutrition summary if needed
      if (mealPlan.nutritionSummary) {
        mealPlan.nutritionSummary = await nutritionUtil.updateNutritionSummary(
          mealPlan.nutritionSummary,
          recipe
        );
      }

      return await mealPlan.save();
    } catch (error) {
      throw new Error(`Error scheduling recipe: ${error.message}`);
    }
  }

  async generateShoppingList(planId) {
    try {
      const mealPlan = await MealPlan.findById(planId).populate('recipes.recipeId');
      if (!mealPlan) throw new Error('Meal plan not found');

      const ingredients = await shoppingUtil.collectIngredients(mealPlan.recipes);
      console.log('Ingredients:', ingredients); // Log ingredients to debug

      // Check for undefined properties in ingredients
      ingredients.forEach(ingredient => {
        if (!ingredient.name) {
          console.error('Ingredient name is undefined:', ingredient);
        }
      });

      const optimizedList = await shoppingUtil.optimizeShoppingList(ingredients);
      console.log('Optimized List:', optimizedList); // Log optimized list to debug

      const shoppingList = new ShoppingList({
        mealPlanId: planId,
        items: optimizedList
      });

      return await shoppingList.save();
    } catch (error) {
      throw new Error(`Error generating shopping list: ${error.message}`);
    }
  }

  async getMealPlan(planId) {
    try {
      const mealPlan = await MealPlan.findById(planId);
      if (!mealPlan) throw new Error('Meal plan not found');
      return mealPlan;
    } catch (error) {
      throw new Error(`Error retrieving meal plan: ${error.message}`);
    }
  }

  async getNutritionSummary(planId) {
    try {
      const mealPlan = await MealPlan.findById(planId).populate('recipes.recipeId');
      if (!mealPlan) throw new Error('Meal plan not found');

      const nutritionSummary = await nutritionUtil.calculateNutritionSummary(mealPlan.recipes);
      return nutritionSummary;
    } catch (error) {
      throw new Error(`Error retrieving nutrition summary: ${error.message}`);
    }
  }

  async validateMealPlan(mealPlanData) {
    if (mealPlanData.startDate >= mealPlanData.endDate) {
      throw new Error('Start date must be before end date');
    }

    const daysDifference = Math.ceil(
      (mealPlanData.endDate - mealPlanData.startDate) / (1000 * 60 * 60 * 24)
    );
    if (daysDifference > 30) {
      throw new Error('Meal plan cannot exceed 30 days');
    }
  }
}

module.exports = new MealPlanService();