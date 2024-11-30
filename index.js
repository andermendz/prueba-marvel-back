require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const md5 = require('md5');

//  agregar auth
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/comics', async (req, res) => {
  try {
    const ts = new Date().getTime();
    const hash = md5(ts + process.env.MARVEL_PRIVATE_KEY + process.env.MARVEL_API_KEY);
    
    const response = await axios.get(`https://gateway.marvel.com/v1/public/comics`, {
      params: {
        ts,
        apikey: process.env.MARVEL_API_KEY,
        hash,
        limit: 20
      }
    });

    res.json(response.data.data.results);
  } catch (error) {
    console.error('Error fetching comics:', error);
    res.status(500).json({ error: 'Error fetching comics' });
  }
});

app.get('/api/comics/:id', async (req, res) => {
  try {
    const ts = new Date().getTime();
    const hash = md5(ts + process.env.MARVEL_PRIVATE_KEY + process.env.MARVEL_API_KEY);
    
    const response = await axios.get(`https://gateway.marvel.com/v1/public/comics/${req.params.id}`, {
      params: {
        ts,
        apikey: process.env.MARVEL_API_KEY,
        hash
      }
    });

    res.json(response.data.data.results[0]);
  } catch (error) {
    console.error('Error fetching comic:', error);
    res.status(500).json({ error: 'Error fetching comic' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});