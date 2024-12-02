const mongoose = require('mongoose');
const IUserRepository = require('../../domain/interfaces/IUserRepository');
const User = require('../../domain/entities/User');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  identification: { type: String, required: true, unique: true },
  favoriteComics: [{ type: Number }]
});

const UserModel = mongoose.model('User', UserSchema);
class MongoUserRepository extends IUserRepository {
  async findById(id) {
    const user = await UserModel.findById(id);
    return user ? new User(user._id, user.email, user.password, user.name, user.identification, user.favoriteComics) : null;
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({ email });
    return user ? new User(user._id, user.email, user.password, user.name, user.identification, user.favoriteComics) : null;
  }

  async findByIdentification(identification) {
    const user = await UserModel.findOne({ identification });
    return user ? new User(user._id, user.email, user.password, user.name, user.identification, user.favoriteComics) : null;
  }

  async save(user) {
    const newUser = new UserModel({
      email: user.email,
      password: user.password,
      name: user.name,
      identification: user.identification,
      favoriteComics: user.favoriteComics
    });
    const savedUser = await newUser.save();
    return new User(savedUser._id, savedUser.email, savedUser.password, savedUser.name, savedUser.identification, savedUser.favoriteComics);
  }

  async update(id, user) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        email: user.email,
        password: user.password,
        name: user.name,
        identification: user.identification,
        favoriteComics: user.favoriteComics
      },
      { new: true }
    );
    return new User(updatedUser._id, updatedUser.email, updatedUser.password, updatedUser.name, updatedUser.identification, updatedUser.favoriteComics);
  }
}


module.exports = MongoUserRepository;
