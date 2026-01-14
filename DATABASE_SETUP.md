# 🗄️ Configuración de Base de Datos PostgreSQL

Esta guía te ayudará a configurar PostgreSQL y pgAdmin para BakerySoft.

## 📋 Requisitos Previos

- PostgreSQL 13+ instalado
- pgAdmin 4 instalado
- Node.js 18+ para el backend

## 🚀 Paso 1: Instalación de PostgreSQL

### Windows:
1. Descarga PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Ejecuta el instalador
3. Durante la instalación:
   - Puerto: `5432` (por defecto)
   - Contraseña del superusuario: **Anótala bien**
   - Instalar pgAdmin 4: **Sí**

### macOS:
```bash
# Con Homebrew
brew install postgresql
brew install --cask pgadmin4

# Iniciar PostgreSQL
brew services start postgresql
```

### Linux (Ubuntu/Debian):
```bash
# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Instalar pgAdmin
sudo apt install pgadmin4
```

## 🔧 Paso 2: Configurar Base de Datos

### 1. Conectar a PostgreSQL como superusuario:
```bash
# Windows/Linux
psql -U postgres

# macOS
psql postgres
```

### 2. Crear base de datos y usuario:
```sql
-- Crear base de datos
CREATE DATABASE bakerysoft_db;

-- Crear usuario
CREATE USER bakerysoft_user WITH PASSWORD '1234';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE bakerysoft_db TO bakerysoft_user;

-- Conectar a la base de datos
\c bakerysoft_db

-- Otorgar permisos en el esquema
GRANT ALL ON SCHEMA public TO bakerysoft_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bakerysoft_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bakerysoft_user;

-- Salir
\q
```

## 🖥️ Paso 3: Configurar pgAdmin

### 1. Abrir pgAdmin 4
- Windows: Buscar "pgAdmin 4" en el menú inicio
- macOS: Aplicaciones → pgAdmin 4
- Linux: `pgadmin4`

### 2. Crear conexión al servidor:
1. Click derecho en "Servers" → "Create" → "Server"
2. **General Tab**:
   - Name: `BakerySoft Local`
3. **Connection Tab**:
   - Host: `localhost`
   - Port: `5432`
   - Database: `bakerysoft_db`
   - Username: `bakerysoft_user`
   - Password: `1234`
   - Save password: ✅
4. Click "Save"

## 🏗️ Paso 4: Ejecutar Esquema de Base de Datos

### Opción 1: Desde pgAdmin (RECOMENDADO)
1. Conectar al servidor BakerySoft Local
2. Expandir: Servers → BakerySoft Local → Databases → bakerysoft_db
3. Click derecho en bakerysoft_db → "Query Tool"
4. Copiar y pegar el contenido completo de `backend/database/schema.sql`
5. Click en "Execute" (⚡) o presionar F5

### Opción 2: Desde línea de comandos
```bash
# Navegar al directorio del backend
cd backend

# Ejecutar esquema
psql -U bakerysoft_user -d bakerysoft_db -f database/schema.sql
```

### Opción 3: Con el script de migración (DESPUÉS DE INSTALAR DEPENDENCIAS)
```bash
# En el directorio backend
npm install
npm run migrate
```

## ⚙️ Paso 5: Configurar Backend

### 1. Instalar dependencias:
```bash
cd backend
npm install
```

### 2. Verificar archivo `.env`:
El archivo `.env` ya está configurado con:
```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bakerysoft_db
DB_USER=bakerysoft_user
DB_PASSWORD=1234

# Servidor
PORT=3001
NODE_ENV=development

# JWT Secret
JWT_SECRET=bakerysoft_super_secret_jwt_key_2024_muy_seguro

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,https://panaderia-management-system.vercel.app
```

### 3. Probar conexión:
```bash
npm run dev
```

Deberías ver:
```
🚀 BakerySoft API ejecutándose en puerto 3001
✅ Conectado a PostgreSQL
📊 Entorno: development
🗄️ Base de datos: bakerysoft_db
```

## 🌱 Paso 6: Poblar con Datos de Ejemplo

```bash
# Ejecutar seed para crear datos de ejemplo
npm run seed
```

Esto creará usuarios de prueba:
- **Admin**: admin / admin123
- **Gerente**: gerente / gerente123
- **Supervisor**: supervisor / supervisor123
- **Empleado**: empleado / empleado123
- **Cliente**: cliente / cliente123

## 🔍 Paso 7: Verificar Instalación

### En pgAdmin:
1. Expandir: bakerysoft_db → Schemas → public → Tables
2. Deberías ver todas las tablas:
   - users
   - employees
   - products
   - raw_materials
   - orders
   - customers
   - recipes
   - production_batches
   - financial_transactions
   - inventory_movements
   - audit_logs
   - system_settings

### Probar API:
```bash
# Probar endpoint de salud
curl http://localhost:3001/health

# Debería responder:
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": ...,
  "version": "1.0.0"
}
```

### Probar autenticación:
```bash
# Login con usuario admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

## 🛠️ Comandos Útiles

### PostgreSQL:
```bash
# Conectar a base de datos
psql -U bakerysoft_user -d bakerysoft_db

# Ver tablas
\dt

# Describir tabla
\d users

# Ver datos de una tabla
SELECT * FROM users LIMIT 5;

# Salir
\q
```

### Backend:
```bash
# Desarrollo
npm run dev

# Migrar base de datos
npm run migrate

# Poblar con datos de prueba
npm run seed

# Resetear base de datos
npm run reset-db
```

## 🚨 Solución de Problemas

### Error: "role does not exist"
```sql
-- Crear usuario si no existe
CREATE USER bakerysoft_user WITH PASSWORD '1234';
```

### Error: "database does not exist"
```sql
-- Crear base de datos
CREATE DATABASE bakerysoft_db;
```

### Error: "permission denied"
```sql
-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE bakerysoft_db TO bakerysoft_user;
GRANT ALL ON SCHEMA public TO bakerysoft_user;
```

### Error de conexión en pgAdmin:
- Verificar que PostgreSQL esté ejecutándose
- Verificar host, puerto, usuario y contraseña
- Verificar firewall (puerto 5432)

### Error "relation does not exist":
- Asegúrate de haber ejecutado el esquema completo
- Verifica que estés conectado a la base de datos correcta
- Ejecuta `npm run migrate` para crear las tablas

## 📊 Estado Actual

✅ **COMPLETADO:**
1. PostgreSQL instalado y configurado
2. pgAdmin conectado
3. Base de datos creada con esquema completo
4. Backend API funcionando
5. Datos de ejemplo poblados

🔄 **SIGUIENTE PASO:**
- Conectar Frontend con Backend API
- Reemplazar localStorage con llamadas HTTP
- Implementar autenticación JWT en frontend

---

¿Necesitas ayuda con algún paso específico? 🤔