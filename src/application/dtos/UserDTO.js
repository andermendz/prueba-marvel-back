class UserDTO {
    constructor(user) {
      this.id = user.id;
      this.email = user.email;
      this.favoriteComics = user.favoriteComics;
    }
  }
  
  module.exports = UserDTO;
  