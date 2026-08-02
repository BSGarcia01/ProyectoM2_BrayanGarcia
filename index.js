
const express = require('express')
const app = express()
app.use(express.json())


let usuarios = [
    {id: 1, nombre: "Brian", email: "brian@gmail.com"},
    {id: 2, nombre: "Carol", email: "carol@gmail.com"},
    {id: 3, nombre: "Zahian", email: "zahian@gmail.com"},
]

app.get('/usuarios', function(req,res){
    res.json(usuarios)
})

app.get('/usuarios/:id', function(req,res){
    let usuario = usuarios.find(function(caja){
        return caja.id === Number(req.params.id)
    })
    if (usuario){
        res.json(usuario)
    }else{
        res.status(404).json("usuario no encontrado")
    }
})


app.post("/usuarios", function(req,res){
    let usuarioNuevo = {id: usuarios.length+1, nombre: req.body.nombre , email: req.body.email}
    usuarios.push(usuarioNuevo)
    res.status(201).json(usuarioNuevo)
})

app.put("/usuarios/:id", function(req,res){
    let actualizacionUsuario = usuarios.find(function(caja){
        return caja.id === Number(req.params.id)
    })
    if(actualizacionUsuario){
        actualizacionUsuario.nombre = req.body.nombre
        actualizacionUsuario.email = req.body.email
        res.json(actualizacionUsuario)
    }
    else{
        res.status(404).json('no se encontro el usuario que quieres actualizar')
    }
})


app.delete("/usuarios/:id", function(req, res){
    let borraUsuario = usuarios.filter(function(caja){
        return caja.id !== Number(req.params.id)
    })
    usuarios = borraUsuario
    res.json({mensaje: "usuario eliminado"})
})



app.listen(3000, function(){
    console.log('servidor corriendo en el puerto 3000')
})
