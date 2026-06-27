require('dotenv').config();
const app = require('./app');

// Use PORT from config or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
