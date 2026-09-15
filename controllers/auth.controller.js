// Controlador de autenticación
// ------------------------------
// register: crea una cuenta nueva. Siempre con rol "user" — nadie puede
// auto-asignarse "admin" desde este endpoint público (eso es a propósito,
// es un tema de seguridad: los admins se crean aparte, no por registro
// abierto). La contraseña se guarda siempre hasheada con bcrypt, nunca
// en texto plano.
//
// login: valida el correo/contraseña contra la base de datos y, si son
// correctos, devuelve un JWT que el frontend debe guardar y mandar en
// cada petición protegida (header Authorization: Bearer <token>).

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SALT_ROUNDS = 10
const TOKEN_EXPIRA_EN = '2h'

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRA_EN }
  )
}

// POST /api/auth/register
export const register = async (req, res) => {
  const { nombre, email, password } = req.body

  // Validación de datos
  if (!nombre || !email || !password) {
    return res
      .status(400)
      .json({ error: 'nombre, email y password son requeridos' })
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'El email no es válido' })
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: 'La contraseña debe tener al menos 6 caracteres' })
  }

  try {
    const [existentes] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    )
    if (existentes.length > 0) {
      return res.status(409).json({ error: 'Ese correo ya está registrado' })
    }

    const passwordHasheada = await bcrypt.hash(password, SALT_ROUNDS)

    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, "user")',
      [nombre, email, passwordHasheada]
    )

    const nuevoUsuario = {
      id: resultado.insertId,
      nombre,
      email,
      rol: 'user',
    }

    res.status(201).json({
      usuario: nuevoUsuario,
      token: generarToken(nuevoUsuario),
    })
  } catch (error) {
    res
      .status(500)
      .json({ error: 'No se pudo registrar el usuario', detail: error.message })
  }
}

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son requeridos' })
  }

  try {
    const [filas] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    )
    const usuario = filas[0]

    // Mensaje genérico a propósito: no decimos si falló el email o la
    // contraseña, para no darle pistas a quien intenta adivinar cuentas.
    if (!usuario) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
    }

    const passwordValida = await bcrypt.compare(password, usuario.password)
    if (!passwordValida) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
    }

    const usuarioPublico = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    }

    res.json({
      usuario: usuarioPublico,
      token: generarToken(usuarioPublico),
    })
  } catch (error) {
    res
      .status(500)
      .json({ error: 'No se pudo iniciar sesión', detail: error.message })
  }
}

// GET /api/auth/me  (requiere estar autenticado)
// Sirve para que el frontend confirme, con el token guardado, quién es
// el usuario actual sin tener que volver a pedir la contraseña.
export const me = async (req, res) => {
  res.json({ usuario: req.usuario })
}
