
function validarTitulo(titulo){
    if(!titulo){
        return "el titulo es requerido"
    }
    return null
}

function validarContenido(contenido){
    if(!contenido){
        return "no escribiste nada en el contenido"
    }
    return null
}


function validarUsuarioId(usuario_id){
    if(!usuario_id)
    {
        return "No haz escrito el ID"
    }
    return null

}
module.exports={validarContenido,validarTitulo, validarUsuarioId}