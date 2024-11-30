const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../domain/entities/User');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(email, password) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email already registered');
      error.code = 'USER_EXISTS';
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(null, email, hashedPassword);
    return await this.userRepository.save(user);
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const error = new Error('Invalid password');
      error.code = 'INVALID_PASSWORD';
      throw error;
    }

    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  async updateFavorites(userId, comicId, action) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    if (action === 'add') {
      user.addFavoriteComic(comicId);
    } else if (action === 'remove') {
      user.removeFavoriteComic(comicId);
    } else {
      const error = new Error('Invalid action');
      error.code = 'INVALID_ACTION';
      throw error;
    }

    await this.userRepository.update(userId, user);
    return user.favoriteComics;
  }

  async getFavorites(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      throw error;
    }
    return user.favoriteComics;
  }
}

module.exports = UserService;
