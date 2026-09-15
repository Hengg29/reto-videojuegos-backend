import { Router } from 'express'
import { getGeneros } from '../controllers/generos.controller.js'

const router = Router()

router.get('/', getGeneros) // GET /api/generos

export default router
