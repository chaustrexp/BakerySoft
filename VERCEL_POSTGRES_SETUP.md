# 🚀 Configuración de Vercel con PostgreSQL

## Paso 1: Crear Base de Datos en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en tu proyecto "panaderia-management-system"
3. Ve a la pestaña **Storage**
4. Click en **Create Database**
5. Selecciona **Postgres**
6. Nombre: `bakerysoft-db`
7. Click en **Create**

## Paso 2: Conectar Base de Datos al Proyecto

Vercel automáticamente agregará estas variables de entorno:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## Paso 3: Agregar Variables de Entorno Adicionales

En Settings → Environment Variables, agrega:

```
JWT_SECRET=bakerysoft_super_secret_jwt_key_2024_muy_seguro
NODE_ENV=production
```

## Paso 4: Ejecutar Migraciones

Opción A - Desde Vercel Dashboard:
1. Ve a Storage → tu base de datos
2. Click en "Query"
3. Copia y pega el contenido de `backend/database/schema.sql`
4. Click en "Run Query"

Opción B - Desde tu computadora:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Conectar a la base de datos
vercel env pull .env.local

# Ejecutar migraciones (necesitarás crear un script)
```

## Paso 5: Poblar con Datos Iniciales

Ejecuta las queries de seed desde el Query Editor de Vercel.


## Paso 6: Instalar Dependencias

```bash
npm install @vercel/postgres bcryptjs jsonwebtoken
```

## Paso 7: Hacer Deploy

```bash
git add .
git commit -m "feat: Agregar Vercel Serverless Functions y Postgres"
git push origin main
```

Vercel detectará automáticamente los cambios y desplegará.

## 🎯 URLs Finales

- **Frontend**: https://tu-proyecto.vercel.app
- **API**: https://tu-proyecto.vercel.app/api/auth/login

## ✅ Verificar Funcionamiento

Prueba el login desde la consola del navegador:

```javascript
fetch('https://tu-proyecto.vercel.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
})
.then(r => r.json())
.then(console.log)
```

## 📝 Notas Importantes

- Vercel Postgres tiene límite gratuito de 256 MB
- Las funciones serverless tienen timeout de 10 segundos
- Los datos persisten entre deploys
- Puedes ver logs en Vercel Dashboard → Functions

