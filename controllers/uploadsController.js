const path = require('path')
const fs = require('fs')

const { response, request } = require('express')

const { Usuario, Producto } = require('../models')
const { subirArchivo } = require('../helpers')

const cargarArchivo = async (req, res = response) => {
  try {
    const nombre = await subirArchivo(req.files, undefined, 'imgs')
    res.json({ nombre })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const actualizarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el ID: ${id}`,
        })
      }
      break

    case 'productos':
      modelo = await Producto.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el ID: ${id}`,
        })
      }
      break

    default:
      return res
        .status(500)
        .json({ msg: 'Coleccion no implementada actualmente' })
  }

  // Limpiar imagenes previas

  if (modelo.img) {
    // Hay verificar la imagen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen)
    }
  }

  modelo.img = await subirArchivo(req.files, undefined, coleccion)

  await modelo.save()

  res.json({ id, coleccion })
}

const mostrarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el ID: ${id}`,
        })
      }
      break

    case 'productos':
      modelo = await Producto.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el ID: ${id}`,
        })
      }
      break

    default:
      return res
        .status(500)
        .json({ msg: 'Coleccion no implementada actualmente' })
  }

  // Limpiar imagenes previas

  if (modelo.img) {
    // Hay verificar la imagen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen)
    }
  }

  const pathNoImage = path.join(__dirname, '../assets/noimage.webp')
  res.sendFile(pathNoImage)
}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
}
