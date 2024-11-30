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
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(null, email, hashedPassword);
    return await this.userRepository.save(user);
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  async updateFavorites(userId, comicId, action) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (action === 'add') {
      user.addFavoriteComic(comicId);
    } else if (action === 'remove') {
      user.removeFavoriteComic(comicId);
    }

    await this.userRepository.update(userId, user);
    return user.favoriteComics;
  }

  async getFavorites(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.favoriteComics;
  }
}

module.exports = UserService;
