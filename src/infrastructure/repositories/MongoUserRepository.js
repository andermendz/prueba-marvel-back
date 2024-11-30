const mongoose = require('mongoose');
const IUserRepository = require('../../domain/interfaces/IUserRepository');
const User = require('../../domain/entities/User');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteComics: [{ type: Number }]
});

const UserModel = mongoose.model('User', UserSchema);

class MongoUserRepository extends IUserRepository {
  async findById(id) {
    const user = await UserModel.findById(id);
    return user ? new User(user._id, user.email, user.password, user.favoriteComics) : null;
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({ email });
    return user ? new User(user._id, user.email, user.password, user.favoriteComics) : null;
  }

  async save(user) {
    const newUser = new UserModel({
      email: user.email,
      password: user.password,
      favoriteComics: user.favoriteComics
    });
    const savedUser = await newUser.save();
    return new User(savedUser._id, savedUser.email, savedUser.password, savedUser.favoriteComics);
  }

  async update(id, user) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        email: user.email,
        password: user.password,
        favoriteComics: user.favoriteComics
      },
      { new: true }
    );
    return new User(updatedUser._id, updatedUser.email, updatedUser.password, updatedUser.favoriteComics);
  }
}

module.exports = MongoUserRepository;
