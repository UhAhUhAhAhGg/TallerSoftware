-- filepath: database/schema.sql
-- Esquema de base de datos para PetMatch
-- Historia de Usuario 1: Registro general + Perfil Adoptante

-- =========================
-- TABLAS BASE
-- =========================

-- Tabla de especies
CREATE TABLE IF NOT EXISTS ESPECIES (
    id_espe serial PRIMARY KEY,
    nom_espe varchar(50) NOT NULL
);

-- Tabla de roles
CREATE TABLE IF NOT EXISTS ROLES (
    id_rol serial PRIMARY KEY,
    nom_rol varchar(50) NOT NULL
);

-- Tabla de estados de solicitudes
CREATE TABLE IF NOT EXISTS ESTAD_SOLI (
    id_est int PRIMARY KEY,
    nom_est varchar(30) NOT NULL
);

-- =========================
-- USUARIOS (AUTH CENTRAL)
-- =========================

CREATE TABLE IF NOT EXISTS USUARIOS (
    id_usuario serial PRIMARY KEY,
    id_rol int NOT NULL,
    telf_usuario varchar(20) NOT NULL DEFAULT '',
    corr_usuario varchar(100) NOT NULL UNIQUE,
    contra_usuario varchar(255) NOT NULL,
    nom_usuario varchar(80) NOT NULL DEFAULT '',
    appell_usuario varchar(80) NOT NULL DEFAULT '',
    fenac_usuario date NOT NULL DEFAULT CURRENT_DATE,
    gen_usuario boolean NOT NULL DEFAULT true,
    direc_usuario text NOT NULL DEFAULT '',

    FOREIGN KEY (id_rol) REFERENCES ROLES(id_rol)
);

-- =========================
-- PERFIL ADOPTANTE (MATCHING)
-- =========================

CREATE TABLE IF NOT EXISTS PERFIL_ADOPTANTE (
    id_perfil serial PRIMARY KEY,
    id_usuario int NOT NULL UNIQUE,

    tipo_vivienda varchar(30) NOT NULL,
    tiene_patio boolean NOT NULL DEFAULT false,
    disp_tiempo varchar(20) NOT NULL,
    exp_previa boolean NOT NULL DEFAULT false,
    desc_exp text,

    pref_especie int,
    pref_tamanio varchar(20),
    pref_edad varchar(20),

    acepta_ninos boolean NOT NULL DEFAULT true,
    acepta_otros boolean NOT NULL DEFAULT true,

    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (pref_especie) REFERENCES ESPECIES(id_espe)
);

-- =========================
-- REFUGIOS
-- =========================

CREATE TABLE IF NOT EXISTS REFUGIOS (
    id_refug serial PRIMARY KEY,
    nom_refug varchar(80) NOT NULL,
    dir_refug varchar(200) NOT NULL,
    telf_refug varchar(20) NOT NULL,
    corr_refug varchar(100) NOT NULL,
    licencia_refug varchar(200) NOT NULL,

    -- Campos de verificación
    est_verif_refug varchar(20) NOT NULL DEFAULT 'pendiente',
    est_refug boolean NOT NULL DEFAULT true
);

-- =========================
-- MASCOTAS
-- =========================

CREATE TABLE IF NOT EXISTS RAZAS (
    id_raza serial PRIMARY KEY,
    id_espe int NOT NULL,
    nom_raza varchar(50) NOT NULL,
    FOREIGN KEY (id_espe) REFERENCES ESPECIES(id_espe)
);

CREATE TABLE IF NOT EXISTS MASCOTAS (
    id_mascot serial PRIMARY KEY,
    id_raza int NOT NULL,
    img_mascot text NOT NULL,
    nom_mascot varchar(80) NOT NULL,
    edad_mascot int NOT NULL,
    fenac_mascot date NOT NULL,
    descrip_mascot text NOT NULL,
    gen_mascot boolean NOT NULL,
    esterilizado boolean NOT NULL,

    FOREIGN KEY (id_raza) REFERENCES RAZAS(id_raza)
);

-- =========================
-- PUBLICACIONES
-- =========================

CREATE TABLE IF NOT EXISTS PUBLICACIONES (
    id_publi serial PRIMARY KEY,
    id_mascot int NOT NULL,
    id_refug int NOT NULL,
    fech_publi timestamp NOT NULL DEFAULT now(),
    fech_baja timestamp,
    arch_publi text NOT NULL,
    decrip_publi text NOT NULL,
    est_adop boolean NOT NULL DEFAULT false,
    est_publi boolean NOT NULL DEFAULT true,

    FOREIGN KEY (id_mascot) REFERENCES MASCOTAS(id_mascot),
    FOREIGN KEY (id_refug) REFERENCES REFUGIOS(id_refug)
);

-- =========================
-- SOLICITUDES DE ADOPCIÓN
-- =========================

CREATE TABLE IF NOT EXISTS SOLI_ADOP (
    id_soli serial PRIMARY KEY,
    id_usuario int NOT NULL,
    id_publi int NOT NULL,
    id_est int NOT NULL,
    fech_soli timestamp NOT NULL DEFAULT now(),
    decrip_soli text NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario),
    FOREIGN KEY (id_publi) REFERENCES PUBLICACIONES(id_publi),
    FOREIGN KEY (id_est) REFERENCES ESTAD_SOLI(id_est)
);

-- =========================
-- HISTORIAL
-- =========================

CREATE TABLE IF NOT EXISTS HISTO_ADOP (
    id_ha serial PRIMARY KEY,
    id_soli int NOT NULL,
    FOREIGN KEY (id_soli) REFERENCES SOLI_ADOP(id_soli)
);

-- =========================
-- NOTIFICACIONES
-- =========================

CREATE TABLE IF NOT EXISTS NOTIFICACIONES (
    id_notif serial PRIMARY KEY,
    id_usuario int NOT NULL,

    tipo_notif varchar(50) NOT NULL,
    titulo_notif varchar(150) NOT NULL,
    cuerpo_notif text NOT NULL,

    leida boolean NOT NULL DEFAULT false,
    fech_notif timestamp NOT NULL DEFAULT now(),

    ref_id int,

    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario) ON DELETE CASCADE
);

-- =========================
-- DATOS INICIALES
-- =========================

-- Insertar roles
INSERT INTO ROLES (nom_rol) VALUES ('administrador'), ('adoptante'), ('refugio')
ON CONFLICT DO NOTHING;

-- Insertar estados de solicitudes
INSERT INTO ESTAD_SOLI (id_est, nom_est) VALUES
(1,'enviada'),
(2,'en revisión'),
(3,'aprobada'),
(4,'rechazada'),
(5,'completada')
ON CONFLICT DO NOTHING;

-- Insertar especies iniciales
INSERT INTO ESPECIES (nom_espe) VALUES
('Perro'),
('Gato'),
('Ave'),
('Conejo'),
('Hamster'),
('Pez'),
('Reptil'),
('Otro')
ON CONFLICT DO NOTHING;

-- Crear índice para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON USUARIOS(corr_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON USUARIOS(id_rol);
CREATE INDEX IF NOT EXISTS idx_perfil_adoptante_usuario ON PERFIL_ADOPTANTE(id_usuario);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON NOTIFICACIONES(id_usuario);