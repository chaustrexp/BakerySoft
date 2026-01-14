# ✅ Pasos Finales en Vercel Dashboard

## 🎯 Lo que ya está hecho:

✅ Código subido a GitHub
✅ Funciones serverless creadas (login, register, me)
✅ Configuración de Vercel lista
✅ Dependencias instaladas
✅ Scripts SQL preparados

## 📋 Pasos que DEBES hacer en Vercel:

### 1️⃣ Crear Base de Datos PostgreSQL

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto "panaderia-management-system"
3. Click en la pestaña **Storage**
4. Click en **Create Database**
5. Selecciona **Postgres**
6. Nombre: `bakerysoft-db`
7. Region: Selecciona la más cercana
8. Click en **Create**

### 2️⃣ Agregar Variable de Entorno JWT_SECRET

1. En tu proyecto, ve a **Settings**
2. Click en **Environment Variables**
3. Agrega esta variable:
   - **Name**: `JWT_SECRET`
   - **Value**: `bakerysoft_super_secret_jwt_key_2024_muy_seguro`
   - **Environment**: Production, Preview, Development (selecciona todos)
4. Click en **Save**

### 3️⃣ Ejecutar Schema de Base de Datos

1. Ve a **Storage** → Click en tu base de datos `bakerysoft-db`
2. Click en la pestaña **Query**
3. Abre el archivo `backend/database/schema.sql` de tu proyecto
4. Copia TODO el contenido
5. Pégalo en el Query Editor de Vercel
6. Click en **Run Query**
7. Espera a que termine (puede tardar 1-2 minutos)

### 4️⃣ Crear Usuarios de Prueba

1. En el mismo Query Editor
2. Abre el archivo `vercel-seed.sql` de tu proyecto
3. Copia el contenido
4. Pégalo en el Query Editor
5. Click en **Run Query**


### 5️⃣ Verificar Despliegue

1. Ve a la pestaña **Deployments**
2. Espera a que el último deployment termine (círculo verde ✅)
3. Click en el deployment
4. Click en **Visit** para abrir tu aplicación

### 6️⃣ Probar Login

1. Abre tu aplicación en Vercel
2. Intenta hacer login con:
   - **Usuario**: admin
   - **Contraseña**: admin123

Si funciona, ¡todo está listo! 🎉

## 🔍 Verificar que Todo Funciona

### Opción A: Desde la Aplicación
- Abre tu app en Vercel
- Haz login con admin/admin123
- Si entras al dashboard, ¡funciona!

### Opción B: Desde la Consola del Navegador
```javascript
// Abre la consola (F12) en tu app de Vercel
fetch('https://tu-app.vercel.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    username: 'admin', 
    password: 'admin123' 
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Login exitoso:', data);
  console.log('Token:', data.data.token);
})
.catch(err => console.error('❌ Error:', err));
```

## 🚨 Solución de Problemas

### Error: "Database not found"
- Asegúrate de haber creado la base de datos en Storage
- Verifica que las variables de entorno estén configuradas

### Error: "relation users does not exist"
- Ejecuta el schema.sql en el Query Editor
- Verifica que todas las tablas se crearon

### Error: "Invalid credentials"
- Ejecuta el vercel-seed.sql para crear usuarios
- Verifica que los hashes de contraseñas sean correctos

### Error 500 en las funciones
- Ve a Deployments → tu deployment → Functions
- Click en la función que falla
- Revisa los logs para ver el error específico

## 📊 Usuarios de Prueba Disponibles

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | Administrador |
| gerente | gerente123 | Gerente |
| supervisor | supervisor123 | Supervisor |
| empleado | empleado123 | Empleado |
| cliente | cliente123 | Cliente |

## 🎯 Próximos Pasos

Una vez que el login funcione en Vercel:
1. ✅ Frontend desplegado
2. ✅ Backend con funciones serverless
3. ✅ Base de datos PostgreSQL en la nube
4. ⏳ Crear más funciones serverless para otros módulos
5. ⏳ Conectar inventario, empleados, productos, etc.

---

**¿Necesitas ayuda?** Revisa los logs en Vercel Dashboard → Functions

