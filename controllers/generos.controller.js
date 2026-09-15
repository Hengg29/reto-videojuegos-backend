// Controlador de "generos"
// -------------------------
// Sirve para llenar los filtros por categoría en el frontend.

import pool from '../config/db.js'

// GET /api/generos -> lista todos los géneros disponibles
export const getGeneros = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre FROM generos ORDER BY nombre')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener los géneros', detail: error.message })
  }
}
