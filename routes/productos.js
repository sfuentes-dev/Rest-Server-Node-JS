const { Router } = require('express')
const { check } = require('express-validator')

const {
  obtenerProductos,
  crearProducto,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require('../controllers/productosController')
const {
  existeCategoriaPorId,
  existeProductoPorId,
} = require('../helpers/db-validators')

const { esAdminRole } = require('../middlewares')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de MongoDB').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto
)

router.get('/', obtenerProductos)

router.get(
  '/:id',
  [
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
)

router.put(
  '/:id',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('categoria', 'No es un ID de MongoDB').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
  ],
  actualizarProducto
)

router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
)

module.exports = router
