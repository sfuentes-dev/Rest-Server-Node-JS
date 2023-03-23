const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT

    // Rutas
    this.paths = {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      categorias: '/api/categorias',
      productos: '/api/productos',
    }

    // Conectar a base de datos
    this.conectarDB()

    // Middlewares
    this.middlewares()

    // Rutas de mi aplicacion
    this.routes()
  }

  async conectarDB() {
    await dbConnection()
  }

  middlewares() {
    // CORS
    this.app.use(cors())

    // Directorio publico
    this.app.use(express.static('public'))

    // Lectura y parseo del body
    this.app.use(express.json())
  }

  routes() {
    this.app.use(this.paths.usuarios, require('../routes/usuarios'))
    this.app.use(this.paths.auth, require('../routes/auth'))
    this.app.use(this.paths.categorias, require('../routes/categorias'))
    this.app.use(this.paths.productos, require('../routes/productos'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Listening on port', this.port)
    })
  }
}

module.exports = Server
