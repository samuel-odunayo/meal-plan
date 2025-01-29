const mongoose = require('mongoose');

const scheduledRecipeSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  
  scheduledTime: {
    type: Date,
    required: true
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  }
});

const nutritionSummarySchema = new mongoose.Schema({
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  });
  
  const mealPlanSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    recipes: [scheduledRecipeSchema],
    nutritionSummary: nutritionSummarySchema,
    nutritionPreferences: {
      type: Map,
      of: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = mongoose.model('MealPlan', mealPlanSchema);
  