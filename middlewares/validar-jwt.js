const { request, response } = require('express')
const Usuario = require('../models/usuario')

const jwt = require('jsonwebtoken')

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la peticion',
    })
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

    // Leer el usuario que corresponde a este uid y alamacenar en req.usuario
    const usuario = await Usuario.findById(uid)

    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no valido - usuario con no existe en DB',
      })
    }

    // Verficiar si el uid tiene el estado en true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Token no valido - usuario con estado: false',
      })
    }

    req.usuario = usuario

    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({
      msg: 'Token no valido',
    })
  }
}

module.exports = {
  validarJWT,
}
