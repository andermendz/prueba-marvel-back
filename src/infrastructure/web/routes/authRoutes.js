const express = require('express');
const router = express.Router();

module.exports = (authService) => {
  router.post('/register', async (req, res) => {
    try {
      const { email, password } = req.body;
      await authService.register(email, password);
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
