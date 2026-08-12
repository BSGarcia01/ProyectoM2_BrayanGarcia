
const { loadEnvFile } = require('node:process')

try{
    loadEnvFile('.env')
} catch (error) {
    // Se deja vacio porque el .env no se sube a produccion, lo necesario llega desde las variables de entorno
}


const app = require('./app')

app.listen(process.env.PORT || 3000, function(){
    console.log(`servidor corriendo en el puerto ${process.env.PORT || 3000}`)
})