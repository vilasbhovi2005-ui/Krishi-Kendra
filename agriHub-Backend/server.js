const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the Agricultural Hub API!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}   );