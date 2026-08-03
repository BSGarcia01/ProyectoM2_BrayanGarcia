
const { loadEnvFile } = require('node:process')
loadEnvFile('.env')

const express = require('express')
const app = express()
app.use(express.json())

const usuariosRouter = require('./routes/usuarios')
app.use('/usuarios', usuariosRouter)


const postsRouter = require('./routes/posts')
app.use('/posts', postsRouter)

app.listen(process.env.PORT || 3000, function(){
    console.log(`servidor corriendo en el puerto ${process.env.PORT || 3000}`)
})