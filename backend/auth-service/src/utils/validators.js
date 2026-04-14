/**
 * Validadores y funciones auxiliares
 */

// Validar formato de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar fortaleza de contraseña
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Sanitizar entrada
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>"']/g, '');
};

module.exports = {
  isValidEmail,
  isValidPassword,
  sanitizeInput
};
