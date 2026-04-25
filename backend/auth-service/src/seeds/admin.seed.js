// filepath: src/seeds/admin.seed.js
const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function seedAdmin() {
  try {
    const correo = 'admin@plataforma.com';
    const contraPlana = 'Admin@123456!';
    const hash = await bcrypt.hash(contraPlana, 12);

    // id_rol = 1 corresponde a 'administrador' según el INSERT de roles
    await pool.query(
      `INSERT INTO USUARIOS 
        (id_rol, telf_usuario, corr_usuario, contra_usuario,
         nom_usuario, appell_usuario, fenac_usuario, gen_usuario, direc_usuario)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT DO NOTHING`,
      [1, '0000000000', correo, hash, 'Admin', 'Sistema', '2000-01-01', true, 'Plataforma']
    );
    console.log('✅ Admin creado exitosamente');
    console.log('   Correo: admin@plataforma.com');
    console.log('   Contraseña: Admin@123456!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear admin:', error);
    process.exit(1);
  }
}

seedAdmin();