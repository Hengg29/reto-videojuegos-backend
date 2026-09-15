// Middlewares de autenticación y autorización
// ----------------------------------------------
// verificarToken: revisa que la petición traiga un JWT válido en el
// header "Authorization: Bearer <token>". Si es válido, guarda los
// datos del usuario en req.usuario para que los siguientes middlewares
// o el controller los puedan usar.
//
// soloAdmin: debe usarse SIEMPRE después de verificarToken. Revisa que
// el usuario autenticado tenga rol "admin"; si no, corta la petición
// con 403 antes de que llegue al controller.

import jwt from 'jsonwebtoken'

export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No se envió un token de acceso' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = payload // { id, email, rol }
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

export function soloAdmin(req, res, next) {
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return res
      .status(403)
      .json({ error: 'Esta acción requiere permisos de administrador' })
  }
  next()
}
