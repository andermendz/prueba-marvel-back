const UserDTO = require('../../application/dtos/UserDTO');

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async register(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.register(email, password);
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      if (error.code === 'USER_EXISTS') {
        res.status(400).json({ error: 'User already exists' });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const token = await this.userService.login(email, password);
      res.json({ token });
    } catch (error) {
      if (error.code === 'USER_NOT_FOUND') {
        res.status(404).json({ error: 'User not found' });
      } else if (error.code === 'INVALID_PASSWORD') {
        res.status(400).json({ error: 'Invalid password' });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async addFavorite(req, res) {
    try {
      const { comicId } = req.body;
      const favorites = await this.userService.updateFavorites(req.user.id, comicId, 'add');
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async removeFavorite(req, res) {
    try {
      const comicId = parseInt(req.params.comicId);
      const favorites = await this.userService.updateFavorites(req.user.id, comicId, 'remove');
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFavorites(req, res) {
    try {
      const favorites = await this.userService.getFavorites(req.user.id);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
