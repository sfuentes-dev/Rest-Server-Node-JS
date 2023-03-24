const { response, request } = require('express')
const { Categoria } = require('../models')

// Obtener categorias - paginado - total - populate
const getCategorias = async (req = request, res = response) => {
  const { limit = 10, skip = 0 } = req.query

  const query = { estado: true }

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('usuario', 'nombre'),
  ])

  res.json({
    total,
    categorias,
  })
}

// Obtener categoira - populate {}
const getCategoria = async (req = request, res = response) => {
  const { id } = req.params

  const categoria = await Categoria.findById(id).populate('usuario', 'nombre')

  res.json(categoria)
}

// actualizarCategoria por nombre
const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params
  const { estado, usuario, ...data } = req.body

  data.nombre = data.nombre.toUpperCase()
  data.usuario = req.usuario._id

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true })

  if (!categoria) {
    const error = new Error('Categoria no encontrada')
    return res.status(404).json({ msg: error.message })
  }

  res.json(categoria)
}

// Borrar categoria, cabiar estado a false
const deleteCategoria = async (req = request, res = response) => {
  const { id } = req.params

  const categoriaBorrada = await Categoria.findByIdAndUpdate(
    id,
    {
      estado: false,
    },
    { new: true }
  )

  res.status(200).json(categoriaBorrada)
}

// Middleware personalizado check id custom existeCategoria, si la cetegoria existe tirrrar un error

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase()

  const categoriaDB = await Categoria.findOne({ nombre })

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`,
    })
  }

  // Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  }

  const categoria = new Categoria(data)

  // Guardar DB
  await categoria.save()

  res.status(201).json(categoria)
}

module.exports = {
  crearCategoria,
  getCategorias,
  getCategoria,
  actualizarCategoria,
  deleteCategoria,
}
