const { Router } = require('express')
const { check } = require('express-validator')

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
} = require('../controllers/usuarios')

const {
  esRoleValido,
  emailExiste,
  existeUsarioPorId,
} = require('../helpers/db-validators')

const {
  tieneRole,
  validarCampos,
  validarJWT,
  esAdminRole,
} = require('../middlewares')

const router = Router()

router.get('/', usuariosGet)

router.put(
  '/:id',
  [
    check('id', 'No es uin ID valido').isMongoId(),
    check('id').custom(existeUsarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
)

router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de minimo 6 letras').isLength({
      min: 6,
    }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo', 'El correo ya existe').custom(emailExiste),
    check('rol').custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
)

router.delete(
  '/:id',
  [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es uin ID valido').isMongoId(),
    check('id').custom(existeUsarioPorId),
    validarCampos,
  ],
  usuariosDelete
)

module.exports = router
