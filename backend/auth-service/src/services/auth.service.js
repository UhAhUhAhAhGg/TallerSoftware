// filepath: src/services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * Validación de contraseña: mín 12 chars, mayúscula, número, carácter especial
 */
function validarContrasena(contra) {
  const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{12,}$/;
  return regex.test(contra);
}

/**
 * Registrar usuario general (adoptante o refugio)
 */
async function registrarUsuario(datos) {
  const { correo, contrasena, rol, nombre, apellido } = datos;

  // 1. Validar que el correo no exista
  const existe = await pool.query(
    'SELECT id_usuario FROM USUARIOS WHERE corr_usuario = $1',
    [correo]
  );
  if (existe.rowCount > 0) {
    throw new Error('El correo ya está registrado');
  }

  // 2. Determinar id_rol (1=admin, 2=adoptante, 3=refugio según el seed)
  const id_rol = rol === 'adoptante' ? 2 : 3;

  // 3. Hashear contraseña
  const hash = await bcrypt.hash(contrasena, 12);

  // 4. Insertar usuario base
  const result = await pool.query(
    `INSERT INTO USUARIOS 
      (id_rol, telf_usuario, corr_usuario, contra_usuario,
       nom_usuario, appell_usuario, fenac_usuario, gen_usuario, direc_usuario)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id_usuario, id_rol, corr_usuario`,
    [id_rol, '', correo, hash, nombre || '', apellido || '', new Date(), true, '']
  );

  const usuario = result.rows[0];

  // 5. Generar JWT con id y rol para que el frontend sepa a qué pantalla redirigir
  const token = jwt.sign(
    { id: usuario.id_usuario, rol: rol, perfilCompleto: false },
    process.env.JWT_SECRET || 'default-secret-key',
    { expiresIn: '7d' }
  );

  return { token, rol, id_usuario: usuario.id_usuario, correo: usuario.corr_usuario };
}

/**
 * Login de usuario
 */
async function loginUsuario(correo, contrasena) {
  // 1. Buscar usuario por correo
  const result = await pool.query(
    `SELECT u.id_usuario, u.id_rol, u.corr_usuario, u.contra_usuario, u.nom_usuario, u.appell_usuario, r.nom_rol
     FROM USUARIOS u
     JOIN ROLES r ON u.id_rol = r.id_rol
     WHERE u.corr_usuario = $1`,
    [correo]
  );

  if (result.rowCount === 0) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const usuario = result.rows[0];

  // 2. Verificar contraseña
  const esValida = await bcrypt.compare(contrasena, usuario.contra_usuario);
  if (!esValida) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  // 3. Determinar nombre del rol
  const nombreRol = usuario.nom_rol;

  // 4. Generar JWT
  const token = jwt.sign(
    { 
      id: usuario.id_usuario, 
      rol: nombreRol.toLowerCase(),
      id_rol: usuario.id_rol
    },
    process.env.JWT_SECRET || 'default-secret-key',
    { expiresIn: '7d' }
  );

  return { 
    token, 
    rol: nombreRol.toLowerCase(),
    id_usuario: usuario.id_usuario,
    nombre: usuario.nom_usuario,
    correo: usuario.corr_usuario
  };
}

/**
 * Obtener datos del usuario actual
 */
async function obtenerUsuarioActual(id_usuario) {
  const result = await pool.query(
    `SELECT u.id_usuario, u.id_rol, u.corr_usuario, u.nom_usuario, u.appell_usuario, r.nom_rol
     FROM USUARIOS u
     JOIN ROLES r ON u.id_rol = r.id_rol
     WHERE u.id_usuario = $1`,
    [id_usuario]
  );

  if (result.rowCount === 0) {
    throw new Error('Usuario no encontrado');
  }

  return result.rows[0];
}

module.exports = {
  validarContrasena,
  registrarUsuario,
  loginUsuario,
  obtenerUsuarioActual
};