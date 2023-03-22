const { response, json } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async (req, res = response) => {
  const { correo, password } = req.body

  try {
    // Verficiar si el email exsite
    const usuario = await Usuario.findOne({ correo })
    console.log(usuario)

    if (!usuario) {
      return res.status(400).json({ msg: 'Usuario / Password no son correctos - correo' })
    }

    // Verficiar si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado',
      })
    }

    // Verficiar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password)

    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password',
      })
    }

    // Generar el JWT
    const token = await generarJWT(usuario._id)

    res.json({
      usuario,
      token,
    })
  } catch (error) {
    return res.status(500).json({
      msg: 'Hable con el administrador',
    })
  }

  res.json({
    msg: 'Login ok',
    correo,
    password,
  })
}

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body

  try {
    const { correo, nombre, img } = await googleVerify(id_token)

    let usuario = await Usuario.findOne({ correo })

    if (!usuario) {
      // Tengo que crearlo
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true,
      }

      usuario = new Usuario(data)
      console.log(usuario)
      await usuario.save()
    }

    // Si el usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado',
      })
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id)

    res.json({
      usuario,
      token,
    })
  } catch (error) {
    res.status(400).json({
      msg: 'Token de Google no es válido',
    })
  }
}

module.exports = {
  login,
  googleSignIn,
}
