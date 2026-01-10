# 🚀 Despliegue con Vercel CLI

## Instalación de Vercel CLI

```bash
npm install -g vercel
```

## Comandos para desplegar

```bash
# 1. Inicializar proyecto
vercel

# 2. Configurar proyecto (primera vez)
# Responde las preguntas:
# - Set up and deploy? Y
# - Which scope? (tu cuenta)
# - Link to existing project? N
# - Project name: panaderia-management-system
# - Directory: ./
# - Override settings? N

# 3. Desplegar a producción
vercel --prod
```

## Configuración automática

El CLI detectará automáticamente:
- Framework: Vite
- Build Command: npm run build
- Output Directory: dist
- Install Command: npm install

## Comandos útiles

```bash
# Ver deployments
vercel ls

# Ver logs
vercel logs

# Abrir proyecto en browser
vercel open

# Eliminar deployment
vercel rm [deployment-url]
```