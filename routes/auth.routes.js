import { Router } from 'express'
import { register, login, me } from '../controllers/auth.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/register', register) // POST /api/auth/register
router.post('/login', login) // POST /api/auth/login
router.get('/me', verificarToken, me) // GET /api/auth/me (protegida)

export default router
