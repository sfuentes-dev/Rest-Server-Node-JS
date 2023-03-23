const { response, request } = require('express')
const { Producto } = require('../models')
const categoria = require('../models/categoria')

const crearProducto = async (req = request, res = response) => {
  const { estado, usuario, ...body } = req.body

  const productoDB = await Producto.findOne({ nombre: body.nombre })

  if (productoDB) {
    return res
      .status(400)
      .json({ msg: `El producto ${productoDB.nombre}, ya existe` })
  }

  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  }

  const producto = new Producto(data)

  await producto.save()

  res.status(201).json(producto)
}

const obtenerProductos = async (req = request, res = response) => {
  const { limit = 5, skip = 0 } = req.query

  const query = { estado: true }

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre'),
  ])

  res.json({
    total,
    productos,
  })
}

const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params

  const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')

  res.json(producto)
}

const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params
  const { estado, usuario, ...data } = req.body

  data.nombre = data.nombre.toUpperCase()
  data.usuario = req.usuario._id

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true })

  if (!producto) {
    const error = new Error('Producto no encontrada')
    return res.status(404).json({ msg: error.message })
  }

  res.json(producto)
}

const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params

  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    {
      estado: false,
    },
    { new: true }
  )

  res.status(200).json(productoBorrado)
}

module.exports = {
  obtenerProductos,
  crearProducto,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
}
