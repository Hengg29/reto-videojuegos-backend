// Script para crear (o actualizar) una cuenta admin de prueba.
// -------------------------------------------------------------
// No hay un endpoint público para crear admins a propósito (sería un
// hueco de seguridad: cualquiera podría auto-asignarse admin). Los
// admins se crean así, corriendo este script una sola vez a mano:
//
//   node scripts/crear-admin.js
//
// Puedes cambiar el correo/nombre/contraseña de prueba editando las
// constantes de abajo, o pasándolos como argumentos:
//
//   node scripts/crear-admin.js admin@gamevault.com "Admin Uno" MiClaveSegura123

import 'dotenv/config'
import bcrypt from 'bcryptjs'
import pool from '../config/db.js'

const [, , argEmail, argNombre, argPassword] = process.argv

const EMAIL = argEmail || 'admin@gamevault.com'
const NOMBRE = argNombre || 'Administrador'
const PASSWORD = argPassword || 'Admin1234'

async function crearAdmin() {
  const hash = await bcrypt.hash(PASSWORD, 10)

  const [existentes] = await pool.query(
    'SELECT id FROM usuarios WHERE email = ?',
    [EMAIL]
  )

  if (existentes.length > 0) {
    await pool.query(
      'UPDATE usuarios SET password = ?, rol = "admin", nombre = ? WHERE email = ?',
      [hash, NOMBRE, EMAIL]
    )
    console.log(`✅ Usuario existente actualizado a admin: ${EMAIL}`)
  } else {
    await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, "admin")',
      [NOMBRE, EMAIL, hash]
    )
    console.log(`✅ Admin creado: ${EMAIL}`)
  }

  console.log(`   Contraseña: ${PASSWORD}`)
  process.exit(0)
}

crearAdmin().catch((error) => {
  console.error('❌ No se pudo crear el admin:', error.message)
  process.exit(1)
})
