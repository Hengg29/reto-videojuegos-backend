// Rutas de "juegos"
// ------------------
// Define qué URL dispara qué función del controlador.
// La lógica real vive en ../controllers/juegos.controller.js

import { Router } from 'express'
import { getJuegos, getJuegoById } from '../controllers/juegos.controller.js'

const router = Router()

router.get('/', getJuegos)       // GET /api/juegos
router.get('/:id', getJuegoById) // GET /api/juegos/:id

export default router
