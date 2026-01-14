-- =====================================================
-- SEED DATA PARA VERCEL POSTGRES
-- =====================================================
-- Ejecuta este script en Vercel Dashboard → Storage → Query
-- después de crear las tablas con schema.sql
-- =====================================================

-- Crear usuarios de prueba
-- Nota: Las contraseñas están hasheadas con bcrypt (10 rounds)
-- Contraseñas en texto plano para referencia:
-- admin: admin123
-- gerente: gerente123
-- supervisor: supervisor123
-- empleado: empleado123
-- cliente: cliente123

INSERT INTO users (username, email, password_hash, name, role, is_active) VALUES
('admin', 'admin@bakerysoft.com', '$2a$10$UIpcbIN3902EMHMbahZgp.YkLkPoD2tKVUY4BoTQHsp2b7JphQ3y6', 'Administrador', 'admin', true),
('gerente', 'gerente@bakerysoft.com', '$2a$10$2MayIbNtDY0yT.wL//NwFuqeNYRY4xiclsczdbrxGlIVXRp7VdZx2', 'Gerente General', 'manager', true),
('supervisor', 'supervisor@bakerysoft.com', '$2a$10$XqjEIIWQMRLFBnq4gFqxF.pGC0VUoBnR2ywwB2CQWj636Ed0Rr0yC', 'Supervisor de Turno', 'supervisor', true),
('empleado', 'empleado@bakerysoft.com', '$2a$10$ULeiZ0zYLSLXC3kJlSq4WeNRlB7sgqarCEp8YZBPpzf6NtqRpQgQy', 'Empleado de Producción', 'employee', true),
('cliente', 'cliente@bakerysoft.com', '$2a$10$Rn0cbIv3jSvtiZDnbxKcF.2lKhXCMD9mseNFl/D7qbsrCz1onMzEa', 'Cliente Demo', 'client', true)
ON CONFLICT (username) DO NOTHING;

-- Verificar que se crearon
SELECT username, email, name, role FROM users;
