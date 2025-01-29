# Meal Plan API

This project is a Meal Planning API built with Node.js, Express, and MongoDB. It allows users to create meal plans, schedule recipes, generate shopping lists, and get nutrition summaries.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/meal-plan.git
   cd meal-plan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory

4. Start the server:
   ```bash
   npm run dev
   ```

## Usage

To use the API, you need to authenticate using a JWT token. You can generate a token using the `token-generator.js` script:

```bash
node token-generator.js
```

Use the generated token in the Authorization header for all API requests.

## API Endpoints

### Meal Plans
- Create a Meal Plan
```bash
POST /api/meal-plans
```
- Get a Meal Plan
```bash
GET /api/meal-plans/:planId
 ```
- Schedule a Recipe
  ```bash
  POST /api/meal-plans/:planId/recipes
  ```
- Generate Shopping List
  ```bash
  GET /api/meal-plans/:planId/shopping-list
  ```
- Get Nutrition Summary
 ```bash
GET /api/meal-plans/:planId/nutrition
```

## Environment Variables

- `PORT`: The port on which the server will run
- `MONGODB_URI`: The MongoDB connection URI
- `JWT_SECRET`: The secret key for JWT token generation
