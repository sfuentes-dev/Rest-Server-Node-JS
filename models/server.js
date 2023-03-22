const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT

    this.usuariosPath = '/api/usuarios'
    this.authPath = '/api/auth'

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
    this.app.use(this.usuariosPath, require('../routes/usuarios'))
    this.app.use(this.authPath, require('../routes/auth'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Listening on port', this.port)
    })
  }
}

module.exports = Server
