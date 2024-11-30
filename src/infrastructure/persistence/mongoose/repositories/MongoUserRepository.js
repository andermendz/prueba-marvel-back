const UserModel = require('../models/UserModel');
const User = require('../../../../domain/entities/User');

class MongoUserRepository extends IUserRepository {
  async findById(id) {
    const userDoc = await UserModel.findById(id);
    return userDoc ? this.toEntity(userDoc) : null;
  }

  async findByEmail(email) {
    const userDoc = await UserModel.findOne({ email });
    return userDoc ? this.toEntity(userDoc) : null;
  }

  async save(user) {
    const userDoc = new UserModel({
      email: user.email,
      password: user.password,
      favoriteComics: user.favoriteComics
    });
    await userDoc.save();
    return this.toEntity(userDoc);
  }

  toEntity(doc) {
    return new User(
      doc._id.toString(),
      doc.email,
      doc.password,
      doc.favoriteComics
    );
  }
}

module.exports = MongoUserRepository;
