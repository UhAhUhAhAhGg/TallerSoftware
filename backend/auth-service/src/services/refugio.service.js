// filepath: src/services/refugio.service.js
const pool = require('../config/db');

/**
 * Guardar datos del refugio y crear solicitud de verificación
 */
async function guardarDatosRefugio(id_usuario, datos) {
  // Verificar que el usuario sea de rol refugio
  const usuario = await pool.query(
    'SELECT id_rol FROM USUARIOS WHERE id_usuario = $1',
    [id_usuario]
  );
  
  if (usuario.rows[0]?.id_rol !== 3) {
    throw new Error('No autorizado: el usuario no es refugio');
  }

  // Verificar si ya tiene datos de refugio asociados
  const refugioExistente = await pool.query(
    'SELECT id_refug FROM REFUGIOS WHERE corr_refug = $1',
    [datos.corr_refug]
  );

  let id_refug;

  if (refugioExistente.rowCount > 0) {
    // Actualizar refugio existente
    id_refug = refugioExistente.rows[0].id_refug;
    await pool.query(
      `UPDATE REFUGIOS 
       SET nom_refug = $1, dir_refug = $2, telf_refug = $3, licencia_refug = $4, est_verif_refug = 'pendiente'
       WHERE id_refug = $5`,
      [datos.nom_refug, datos.dir_refug, datos.telf_refug, datos.licencia_refug, id_refug]
    );
  } else {
    // Crear nuevo refugio
    const result = await pool.query(
      `INSERT INTO REFUGIOS 
        (nom_refug, dir_refug, telf_refug, corr_refug, licencia_refug, est_verif_refug)
       VALUES ($1, $2, $3, $4, $5, 'pendiente')
       RETURNING id_refug`,
      [datos.nom_refug, datos.dir_refug, datos.telf_refug, datos.corr_refug, datos.licencia_refug]
    );
    id_refug = result.rows[0].id_refug;
  }

  // Actualizar el usuario con la referencia al refugio
  await pool.query(
    'UPDATE USUARIOS SET id_refug = $1 WHERE id_usuario = $2',
    [id_refug, id_usuario]
  );

  // Crear notificación para el administrador
  await pool.query(
    `INSERT INTO NOTIFICACIONES 
      (id_usuario, tipo_notif, titulo_notif, cuerpo_notif, ref_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      id_usuario,
      'solicitud_refugio',
      'Nuevo refugio pendiente de aprobación',
      `El refugio "${datos.nom_refug}" ha completado su perfil y espera validación.`,
      id_refug
    ]
  );

  return {
    id_refug,
    nom_refug: datos.nom_refug,
    estado: 'pendiente',
    mensaje: 'Tu refugio está pendiente de validación por un administrador'
  };
}

/**
 * Obtener datos del refugio por ID de usuario
 */
async function obtenerDatosRefugio(id_usuario) {
  const result = await pool.query(
    `SELECT r.*, u.corr_usuario as corr_usuario
     FROM REFUGIOS r
     JOIN USUARIOS u ON u.id_refug = r.id_refug
     WHERE u.id_usuario = $1`,
    [id_usuario]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

/**
 * Obtener todos los refugios pendientes (solo admin)
 */
async function obtenerRefugiosPendientes() {
  const result = await pool.query(
    `SELECT r.id_refug, r.nom_refug, r.dir_refug, r.telf_refug, r.corr_refug, 
            r.licencia_refug, r.est_verif_refug, r.est_refug,
            u.id_usuario, u.nom_usuario, u.appell_usuario, u.corr_usuario,
            u.fenac_usuario
     FROM REFUGIOS r
     JOIN USUARIOS u ON u.id_refug = r.id_refug
     WHERE r.est_verif_refug = 'pendiente'
     ORDER BY r.id_refug DESC`
  );

  return result.rows;
}

/**
 * Obtener refugio por ID (solo admin)
 */
async function obtenerRefugioPorId(id_refug) {
  const result = await pool.query(
    `SELECT r.*, u.id_usuario, u.nom_usuario, u.appell_usuario, u.corr_usuario, u.fenac_usuario
     FROM REFUGIOS r
     JOIN USUARIOS u ON u.id_refug = r.id_refug
     WHERE r.id_refug = $1`,
    [id_refug]
  );

  if (result.rowCount === 0) {
    throw new Error('Refugio no encontrado');
  }

  return result.rows[0];
}

/**
 * Aprobar o rechazar refugio (solo admin)
 */
async function cambiarEstadoRefugio(id_refug, nuevo_estado) {
  if (!['aprobado', 'rechazado'].includes(nuevo_estado)) {
    throw new Error('Estado inválido');
  }

  const result = await pool.query(
    `UPDATE REFUGIOS 
     SET est_verif_refug = $1
     WHERE id_refug = $2
     RETURNING *`,
    [nuevo_estado, id_refug]
  );

  if (result.rowCount === 0) {
    throw new Error('Refugio no encontrado');
  }

  // Crear notificación para el refugio
  const refugio = await pool.query(
    'SELECT id_usuario FROM USUARIOS WHERE id_refug = $1',
    [id_refug]
  );

  if (refugio.rowCount > 0) {
    const titulo = nuevo_estado === 'aprobado' 
      ? '¡Tu refugio ha sido aprobado!' 
      : 'Tu solicitud de refugio ha sido rechazada';
    
    const cuerpo = nuevo_estado === 'aprobado'
      ? 'Felicitaciones! Tu refugio ha sido aprobado. Ahora puedes publicar mascotas.'
      : 'Lo sentimos, tu solicitud de refugio ha sido rechazada. Contacta al administrador para más información.';

    await pool.query(
      `INSERT INTO NOTIFICACIONES 
        (id_usuario, tipo_notif, titulo_notif, cuerpo_notif, ref_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [refugio.rows[0].id_usuario, 'estado_refugio', titulo, cuerpo, id_refug]
    );
  }

  return result.rows[0];
}

module.exports = {
  guardarDatosRefugio,
  obtenerDatosRefugio,
  obtenerRefugiosPendientes,
  obtenerRefugioPorId,
  cambiarEstadoRefugio
};