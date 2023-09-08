const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Simulated Pantry data (in-memory key-value store)
const pantryData = {};

app.use(cors());
app.use(bodyParser.json());

// Create (POST) an item in the Pantry
app.post('/add-item', (req, res) => {
  const { pantryId, basketKey, value } = req.body;
  if (!pantryData[pantryId]) {
    pantryData[pantryId] = {};
  }
  pantryData[pantryId][basketKey] = value;
  res.status(201).json({ message: 'Item added successfully' });
});

// Read (GET) an item from the Pantry
app.get('/get-item', (req, res) => {
  const { pantryId, basketKey } = req.query;
  if (pantryData[pantryId] && pantryData[pantryId][basketKey]) {
    const value = pantryData[pantryId][basketKey];
    res.json({ value });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// List Baskets (GET) in the Pantry
app.get('/list-baskets', (req, res) => {
  const { pantryId, filterByName } = req.query;
  if (pantryData[pantryId]) {
    const baskets = Object.keys(pantryData[pantryId]);
    if (filterByName) {
      const filteredBaskets = baskets.filter((basketKey) =>
        basketKey.includes(filterByName)
      );
      res.json({ baskets: filteredBaskets });
    } else {
      res.json({ baskets });
    }
  } else {
    res.status(404).json({ message: 'Pantry not found' });
  }
});

// Update (PUT) an item in the Pantry
app.put('/update-item', (req, res) => {
  const { pantryId, basketKey, value } = req.body;
  if (pantryData[pantryId] && pantryData[pantryId][basketKey]) {
    pantryData[pantryId][basketKey] = value;
    res.json({ message: 'Item updated successfully' });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Delete (DELETE) an item from the Pantry
app.delete('/delete-item', (req, res) => {
  const { pantryId, basketKey } = req.query;
  if (pantryData[pantryId] && pantryData[pantryId][basketKey]) {
    delete pantryData[pantryId][basketKey];
    res.json({ message: 'Item deleted successfully' });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
