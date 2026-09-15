import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import healthRoutes from './routes/health.routes.js'
import juegosRoutes from './routes/juegos.routes.js'
import generosRoutes from './routes/generos.routes.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors()) 
app.use(express.json()) 

// Rutas
app.use('/api', healthRoutes) // /api/health, /api/db-health
app.use('/api/juegos', juegosRoutes) // /api/juegos, /api/juegos/:id
app.use('/api/generos', generosRoutes) // /api/generos

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`)
})
