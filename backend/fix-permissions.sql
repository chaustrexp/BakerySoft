-- =====================================================
-- OTORGAR PERMISOS AL USUARIO bakerysoft_user
-- =====================================================
-- Ejecuta este script en pgAdmin Query Tool

-- Conectar a la base de datos bakerysoft_db primero
-- \c bakerysoft_db

-- Otorgar todos los permisos en el esquema public
GRANT ALL ON SCHEMA public TO bakerysoft_user;

-- Otorgar permisos en todas las tablas existentes
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bakerysoft_user;

-- Otorgar permisos en todas las secuencias (para IDs auto-incrementales)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bakerysoft_user;

-- Otorgar permisos en todas las funciones
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO bakerysoft_user;

-- Otorgar permisos para tablas futuras (por si acaso)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bakerysoft_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bakerysoft_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO bakerysoft_user;

-- Verificar permisos
SELECT 
    grantee, 
    table_schema, 
    table_name, 
    privilege_type 
FROM information_schema.table_privileges 
WHERE grantee = 'bakerysoft_user' 
ORDER BY table_name;
