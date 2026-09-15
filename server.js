// Servidor backend con Express
// -----------------------------
// Este archivo solo arma la app: conecta middlewares y monta las rutas.
// La lógica de cada endpoint vive en /controllers, y las URLs se definen
// en /routes. Así el proyecto queda organizado a medida que crece:
//
//   routes/       -> qué URL dispara qué función
//   controllers/  -> qué hace cada función (la lógica)
//   config/       -> configuración compartida (ej. conexión a MySQL)

import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import healthRoutes from './routes/health.routes.js'

const app = express()
const PORT = process.env.PORT || 4000

// Middlewares
app.use(cors()) // permite que el frontend (otro puerto) llame a esta API
app.use(express.json()) // permite leer JSON en el body de las peticiones

// Rutas
app.use('/api', healthRoutes) // /api/health, /api/db-health

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`)
})
