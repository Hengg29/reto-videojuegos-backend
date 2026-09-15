import pool from '../config/db.js'

// GET /api/juegos -> lista todos los juegos con nombre de género y clasificación
export const getJuegos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        j.id,
        j.titulo,
        j.descripcion,
        j.imagen_url,
        j.precio,
        j.fecha_lanzamiento,
        j.desarrollador,
        g.id   AS genero_id,
        g.nombre AS genero,
        c.id   AS clasificacion_id,
        c.codigo AS clasificacion_codigo,
        c.nombre AS clasificacion
      FROM juegos j
      LEFT JOIN generos g ON j.genero_id = g.id
      LEFT JOIN clasificaciones c ON j.clasificacion_id = c.id
      ORDER BY j.id
    `)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener los juegos', detail: error.message })
  }
}

// GET /api/juegos/:id -> un solo juego, con la misma info detallada
export const getJuegoById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        j.id,
        j.titulo,
        j.descripcion,
        j.imagen_url,
        j.precio,
        j.fecha_lanzamiento,
        j.desarrollador,
        g.id   AS genero_id,
        g.nombre AS genero,
        c.id   AS clasificacion_id,
        c.codigo AS clasificacion_codigo,
        c.nombre AS clasificacion
      FROM juegos j
      LEFT JOIN generos g ON j.genero_id = g.id
      LEFT JOIN clasificaciones c ON j.clasificacion_id = c.id
      WHERE j.id = ?
      `,
      [req.params.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' })
    }
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener el juego', detail: error.message })
  }
}
