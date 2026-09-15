// Rutas de "salud" del sistema
// -----------------------------
// Sirven para comprobar que el servidor y la base de datos están vivos.

import { Router } from 'express'
import pool from '../config/db.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando correctamente ' })
})

router.get('/db-health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', message: 'Conexión a MySQL exitosa' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'No se pudo conectar a MySQL', detail: error.message })
  }
})

export default router
