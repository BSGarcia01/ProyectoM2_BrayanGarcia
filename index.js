
const { loadEnvFile } = require('node:process')
loadEnvFile('.env')

const app = require('./app')

app.listen(process.env.PORT || 3000, function(){
    console.log(`servidor corriendo en el puerto ${process.env.PORT || 3000}`)
})