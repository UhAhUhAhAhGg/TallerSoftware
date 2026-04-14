const User = require("../models/User");
const { isValidEmail, isValidPassword } = require("../utils/validators");

/**
 * Login - Autentica un usuario
 * POST /api/auth/login
 */
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        error: "Email y contraseña son requeridos"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "Email inválido"
      });
    }

    // Buscar usuario (aquí irá lógica de BD)
    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: "Usuario o contraseña incorrectos"
      });
    }

    // TODO: Comparar contraseña con hash (bcrypt)
    if (user.password !== password) {
      return res.status(401).json({
        error: "Usuario o contraseña incorrectos"
      });
    }

    // Respuesta exitosa
    res.json({
      success: true,
      message: "Login exitoso",
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token: "jwt-token-aqui" // TODO: Generar JWT
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en el servidor",
      message: error.message
    });
  }
};

/**
 * Register - Registra un nuevo usuario
 * POST /api/auth/register
 */
const register = (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validaciones
    if (!email || !password || !name) {
      return res.status(400).json({
        error: "Email, contraseña y nombre son requeridos"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "Email inválido"
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: "Contraseña debe tener al menos 6 caracteres"
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: "El email ya está registrado"
      });
    }

    // TODO: Hash de contraseña (bcrypt)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = User.create({
      email,
      password, // TODO: usar hashedPassword
      name
    });

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en el servidor",
      message: error.message
    });
  }
};

/**
 * Logout - Cierra la sesión
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  try {
    // TODO: Invalidar token si usas JWT
    res.json({
      success: true,
      message: "Sesión cerrada"
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en el servidor",
      message: error.message
    });
  }
};

/**
 * Get current user - Obtiene datos del usuario actual
 * GET /api/auth/me
 */
const getCurrentUser = (req, res) => {
  try {
    // TODO: Obtener de token JWT
    res.json({
      success: true,
      user: {
        id: 1,
        email: "user@example.com",
        name: "John Doe"
      }
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en el servidor",
      message: error.message
    });
  }
};

module.exports = {
  login,
  register,
  logout,
  getCurrentUser
};
