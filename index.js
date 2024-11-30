require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const md5 = require('md5');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const PORT = 5000;

//  conexion mongo
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Amiddleware para autenticacion
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};


app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


app.post('/api/favorites', auth, async (req, res) => {
  try {
    const { comicId } = req.body;
    req.user.favoriteComics.push(comicId);
    await req.user.save();
    res.send(req.user.favoriteComics);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/favorites/:comicId', auth, async (req, res) => {
  try {
    req.user.favoriteComics = req.user.favoriteComics.filter(
      id => id !== parseInt(req.params.comicId)
    );
    await req.user.save();
    res.send(req.user.favoriteComics);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/favorites', auth, async (req, res) => {
  try {
    res.send(req.user.favoriteComics);
  } catch (error) {
    res.status(400).send(error);
  }
});

// endpoint de marvel 
const MARVEL_API_BASE_URL = 'https://gateway.marvel.com/v1/public';
const PUBLIC_KEY = process.env.MARVEL_PUBLIC_KEY;
const PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY;

app.get('/api/comics', async (req, res) => {
  try {
    const timestamp = new Date().getTime();
    const hash = md5(timestamp + PRIVATE_KEY + PUBLIC_KEY);
    
    const response = await axios.get(`${MARVEL_API_BASE_URL}/comics`, {
      params: {
        ts: timestamp,
        apikey: PUBLIC_KEY,
        hash: hash,
        limit: 20
      }
    });
    
    res.json(response.data.data.results);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/api/comics/:id', async (req, res) => {
  try {
    const timestamp = new Date().getTime();
    const hash = md5(timestamp + PRIVATE_KEY + PUBLIC_KEY);
    
    const response = await axios.get(`${MARVEL_API_BASE_URL}/comics/${req.params.id}`, {
      params: {
        ts: timestamp,
        apikey: PUBLIC_KEY,
        hash: hash
      }
    });
    
    res.json(response.data.data.results[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
