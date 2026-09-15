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

// POST /api/juegos -> crea un juego nuevo (solo admin, ver routes/juegos.routes.js)
export const createJuego = async (req, res) => {
  const {
    titulo,
    descripcion,
    imagen_url,
    precio,
    fecha_lanzamiento,
    desarrollador,
    genero_id,
    clasificacion_id,
  } = req.body

  // Validación de datos: lo mínimo indispensable para tener un juego útil
  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ error: 'El campo "titulo" es requerido' })
  }
  if (precio !== undefined && Number.isNaN(Number(precio))) {
    return res.status(400).json({ error: 'El campo "precio" debe ser un número' })
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO juegos
        (titulo, descripcion, imagen_url, precio, fecha_lanzamiento, desarrollador, genero_id, clasificacion_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        descripcion || null,
        imagen_url || null,
        precio || 0,
        fecha_lanzamiento || null,
        desarrollador || null,
        genero_id || null,
        clasificacion_id || null,
      ]
    )
    res.status(201).json({ id: resultado.insertId, titulo })
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear el juego', detail: error.message })
  }
}

// PUT /api/juegos/:id -> actualiza un juego existente (solo admin)
export const updateJuego = async (req, res) => {
  const { id } = req.params
  const {
    titulo,
    descripcion,
    imagen_url,
    precio,
    fecha_lanzamiento,
    desarrollador,
    genero_id,
    clasificacion_id,
  } = req.body

  try {
    const [existe] = await pool.query('SELECT id FROM juegos WHERE id = ?', [id])
    if (existe.length === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' })
    }

    await pool.query(
      `UPDATE juegos SET
        titulo = COALESCE(?, titulo),
        descripcion = COALESCE(?, descripcion),
        imagen_url = COALESCE(?, imagen_url),
        precio = COALESCE(?, precio),
        fecha_lanzamiento = COALESCE(?, fecha_lanzamiento),
        desarrollador = COALESCE(?, desarrollador),
        genero_id = COALESCE(?, genero_id),
        clasificacion_id = COALESCE(?, clasificacion_id)
       WHERE id = ?`,
      [
        titulo,
        descripcion,
        imagen_url,
        precio,
        fecha_lanzamiento,
        desarrollador,
        genero_id,
        clasificacion_id,
        id,
      ]
    )

    res.json({ id: Number(id), mensaje: 'Juego actualizado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar el juego', detail: error.message })
  }
}

// DELETE /api/juegos/:id -> elimina un juego (solo admin)
export const deleteJuego = async (req, res) => {
  const { id } = req.params

  try {
    const [resultado] = await pool.query('DELETE FROM juegos WHERE id = ?', [id])
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' })
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el juego', detail: error.message })
  }
}
