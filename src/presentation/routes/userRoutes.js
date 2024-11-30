const express = require('express');
const { authenticateToken } = require('../middleware/auth');

function createUserRouter(userController) {
  const router = express.Router();

  router.post('/register', (req, res) => userController.register(req, res));
  router.post('/login', (req, res) => userController.login(req, res));
  router.get('/favorites', authenticateToken, (req, res) => userController.getFavorites(req, res));
  router.post('/favorites', authenticateToken, (req, res) => userController.addFavorite(req, res));
  router.delete('/favorites/:comicId', authenticateToken, (req, res) => userController.removeFavorite(req, res));

  return router;
}

module.exports = createUserRouter;
