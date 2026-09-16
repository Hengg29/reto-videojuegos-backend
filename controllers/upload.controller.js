// Controlador de subida de imágenes
// ------------------------------------
// El archivo ya llegó guardado a /uploads (eso lo hizo el middleware
// de multer). Aquí solo devolvemos la URL con la que el frontend
// puede mostrar/guardar esa imagen.

export const subirImagen = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se envió ningún archivo' })
  }

  res.status(201).json({
    url: `/uploads/${req.file.filename}`,
    nombreOriginal: req.file.originalname,
  })
}
