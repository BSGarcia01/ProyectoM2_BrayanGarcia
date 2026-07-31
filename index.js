
const express = require('express')
const app = express()
app.use(express.json())


let posts = [
    { id: 1, titulo: "Mi primer post", contenido: "Contenido del primer post" },
    { id: 2, titulo: "Segundo post", contenido: "Contenido del segundo post" },
    { id: 3, titulo: "Tercer post", contenido: "Contenido del tercer post" }
]


//////// GET
app.get('/posts', function(req,res){
    res.json(posts)
}
)

app.get('/posts/:id', function(req, res){
    let cajon = posts.find(function(caja){
        return caja.id === Number(req.params.id)
    })
    if (cajon){
            res.json(cajon)
    }
    else{
        res.status(404).json('el valor ingresado no existe')
    }
    
})

//////////POST 
app.post("/posts", function(req, res){
    let postNuevo = {id: posts.length+1, titulo: req.body.titulo, contenido: req.body.contenido}
    posts.push(postNuevo)
    res.status(201).json(postNuevo)
})







app.listen(3000, function(){
    console.log('servidor corriendo en el puerto 3000')
})
