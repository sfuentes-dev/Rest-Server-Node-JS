const { Router } = require('express')
const { check } = require('express-validator')
const {
  crearCategoria,
  getCategorias,
  getCategoria,
  actualizarCategoria,
  deleteCategoria,
} = require('../controllers/categoriasController')

const { existeCategoriaPorId } = require('../helpers/db-validators')
const { esAdminRole } = require('../middlewares')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()

//Obtener todas las categorias - publico - GET
router.get('/', getCategorias)

// Obtener una categoria por id - publico - GET
router.get(
  '/:id',
  [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  getCategoria
)

// Crear una categoria - privado - cualquier persona con token valido - POST
router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT,
  ],
  crearCategoria
)

// Actualizar un registro por id - Cualquier con token voalido - PUT
router.put(
  '/:id',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  actualizarCategoria
)

// Borrar una categoria - Admin - DELETE
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  deleteCategoria
)

module.exports = router
