require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/infrastructure/database/mongoose');
const MongoUserRepository = require('./src/infrastructure/repositories/MongoUserRepository');
const UserService = require('./src/application/services/UserService');
const UserController = require('./src/presentation/controllers/UserController');
const createUserRouter = require('./src/presentation/routes/userRoutes');
const axios = require('axios');
const md5 = require('md5');

const app = express();
const PORT = 5000;

connectDB();

// middlewre
app.use(cors({
  origin: ['https://prueba-marvel-front.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// iniciadas dependencias
const userRepository = new MongoUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// ruta user
app.use('/api', createUserRouter(userController));

// ruta marvel api gatewa
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
