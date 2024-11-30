class User {
    constructor(id, email, password, favoriteComics = []) {
      this.id = id;
      this.email = email;
      this.password = password;
      this.favoriteComics = favoriteComics;
    }
  
    addFavoriteComic(comicId) {
      if (!this.favoriteComics.includes(comicId)) {
        this.favoriteComics.push(comicId);
      }
    }
  
    removeFavoriteComic(comicId) {
      this.favoriteComics = this.favoriteComics.filter(id => id !== comicId);
    }
  }
  
  module.exports = User;
  