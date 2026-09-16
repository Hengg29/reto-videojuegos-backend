import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import healthRoutes from './routes/health.routes.js'
import juegosRoutes from './routes/juegos.routes.js'
import generosRoutes from './routes/generos.routes.js'
import authRoutes from './routes/auth.routes.js'
import uploadRoutes from './routes/upload.routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(cors())
app.use(express.json())

// Sirve los archivos de /uploads como estáticos (ej. /uploads/abc123.webp).
// El frontend vive en otro dominio, así que hay que relajar el
// Cross-Origin-Resource-Policy que pone helmet por defecto (same-origin);
// si no, el navegador bloquea mostrar estas imágenes en el <img> del front.
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    },
  })
)

// Rutas
app.use('/api', healthRoutes) // /api/health, /api/db-health
app.use('/api/juegos', juegosRoutes) // /api/juegos, /api/juegos/:id
app.use('/api/generos', generosRoutes) // /api/generos
app.use('/api/auth', authRoutes) // /api/auth/register, /api/auth/login, /api/auth/me
app.use('/api/upload', uploadRoutes) // /api/upload (subir imágenes)

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`)
})
