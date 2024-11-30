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

// conexion mongo
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// autenticacion
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});


// Favorites routes
app.post('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const { comicId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.favoriteComics.includes(comicId)) {
      user.favoriteComics.push(comicId);
      await user.save();
    }
    res.json(user.favoriteComics);
  } catch (error) {
    res.status(500).json({ error: 'Error adding favorite' });
  }
});

app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favoriteComics);
  } catch (error) {
    res.status(500).json({ error: 'Error getting favorites' });
  }
});

app.delete('/api/favorites/:comicId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favoriteComics = user.favoriteComics.filter(id => id !== parseInt(req.params.comicId));
    await user.save();
    res.json(user.favoriteComics);
  } catch (error) {
    res.status(500).json({ error: 'Error removing favorite' });
  }
});

// ruta marvel api
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
    res.status(500).json({ error: 'Error fetching comic' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
