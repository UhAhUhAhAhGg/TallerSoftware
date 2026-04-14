/**
 * Modelos (Para cuando uses base de datos)
 * Aquí irían los schemas de Mongoose o cualquier ORM
 * 
 * Ejemplo con Mongoose (cuando agregues MongoDB):
 * 
 * const mongoose = require('mongoose');
 * 
 * const userSchema = new mongoose.Schema({
 *   email: { type: String, required: true, unique: true },
 *   password: { type: String, required: true },
 *   name: String,
 *   createdAt: { type: Date, default: Date.now }
 * });
 * 
 * module.exports = mongoose.model('User', userSchema);
 */

// Por ahora, usando un mock en memoria
const users = [];

const User = {
  create: (userData) => {
    const user = { id: Date.now(), ...userData };
    users.push(user);
    return user;
  },
  
  findByEmail: (email) => {
    return users.find(u => u.email === email);
  },
  
  findById: (id) => {
    return users.find(u => u.id === Number(id));
  },
  
  getAll: () => users
};

module.exports = User;
