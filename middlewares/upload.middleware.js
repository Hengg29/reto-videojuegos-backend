import multer from 'multer'
import crypto from 'crypto'
import path from 'path'

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const TAMANO_MAXIMO = 5 * 1024 * 1024 // 5 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase()
    const nombreUnico = crypto.randomBytes(16).toString('hex') // 32 caracteres
    cb(null, `${nombreUnico}${extension}`)
  },
})

function filtroDeArchivo(req, file, cb) {
  if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
    return cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif)'))
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter: filtroDeArchivo,
  limits: { fileSize: TAMANO_MAXIMO },
})
