class User {
  constructor(id, email, password, name, identification, favoriteComics = []) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.identification = identification;
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
  