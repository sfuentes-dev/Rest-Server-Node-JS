const { Router } = require('express')
const { check } = require('express-validator')

const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
} = require('../controllers/uploadsController')
const { coleccionesPermitidas } = require('../helpers')

const { validarCampos, validarArchivoSubir } = require('../middlewares')

const router = Router()

router.post('/', validarArchivoSubir, cargarArchivo)

router.put(
  '/:coleccion/:id',
  [
    validarArchivoSubir,
    check('id', 'El id debe ser de MongoDB').isMongoId(),
    check('coleccion').custom((c) =>
      coleccionesPermitidas(c, ['usuarios', 'productos'])
    ),
    validarCampos,
  ],
  actualizarImagen
)

router.get(
  '/:coleccion/:id',
  [
    check('id', 'El id debe ser de MongoDB').isMongoId(),
    check('coleccion').custom((c) =>
      coleccionesPermitidas(c, ['usuarios', 'productos'])
    ),
    validarCampos,
  ],
  mostrarImagen
)

module.exports = router
