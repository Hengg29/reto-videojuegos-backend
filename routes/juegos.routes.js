// Rutas de "juegos"
// ------------------
// Define qué URL dispara qué función del controlador.
// La lógica real vive en ../controllers/juegos.controller.js
//
// GET es público (cualquiera puede ver el catálogo). Crear/editar/borrar
// requiere estar logueado (verificarToken) y ser admin (soloAdmin).

import { Router } from 'express'
import {
  getJuegos,
  getJuegoById,
  createJuego,
  updateJuego,
  deleteJuego,
} from '../controllers/juegos.controller.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', getJuegos) // GET /api/juegos
router.get('/:id', getJuegoById) // GET /api/juegos/:id

router.post('/', verificarToken, soloAdmin, createJuego) // POST /api/juegos
router.put('/:id', verificarToken, soloAdmin, updateJuego) // PUT /api/juegos/:id
router.delete('/:id', verificarToken, soloAdmin, deleteJuego) // DELETE /api/juegos/:id

export default router
