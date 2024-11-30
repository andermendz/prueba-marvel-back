const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
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
    return this.userRepository.save(user);
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
}

module.exports = AuthService;
