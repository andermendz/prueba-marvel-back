class IUserRepository {
    async findById(id) { throw new Error('Method not implemented'); }
    async findByEmail(email) { throw new Error('Method not implemented'); }
    async save(user) { throw new Error('Method not implemented'); }
    async update(user) { throw new Error('Method not implemented'); }
  }
  
  module.exports = IUserRepository;
  