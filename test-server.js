const express = require('express');
const app = express();
const PORT = 8004;

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});