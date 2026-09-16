import { Router } from 'express'
import multer from 'multer'
import { upload } from '../middlewares/upload.middleware.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'
import { subirImagen } from '../controllers/upload.controller.js'

const router = Router()

// Envolvemos upload.single(...) a mano para capturar sus errores
// (archivo muy pesado, tipo no permitido) y responder siempre JSON en
// español — si no, Express usa su manejador de errores por defecto
// (HTML) o el mensaje en inglés que trae multer de fábrica.
function manejarSubida(req, res, next) {
  upload.single('imagen')(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'La imagen no puede pesar más de 5 MB' })
    }
    if (error) {
      return res.status(400).json({ error: error.message })
    }
    next()
  })
}

router.post('/', verificarToken, soloAdmin, manejarSubida, subirImagen) // POST /api/upload

export default router
