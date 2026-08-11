const express = require('express')
const router = express.Router()
const pool = require('../db/config')
const validadores = require("../validators/posts")



router.get('/', async function(req, res){
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY id')
        res.json(result.rows)
    } catch (error) {
        console.error('Error obteniendo posts:', error)
        res.status(500).json({ error: 'Error obteniendo posts' })
    }
})


router.get('/:id', async function(req, res){
    try {
        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id])
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado' })
        }
        res.json(result.rows[0])
    } catch (error) {
        console.error('Error obteniendo post:', error)
        res.status(500).json({ error: 'Error obteniendo post' })
    }
})


router.post('/', async function(req, res){
    const { titulo, contenido, usuario_id } = req.body
    const errorTitulo = validadores.validarTitulo(titulo)
    if (errorTitulo) {
        return res.status(400).json({ error: errorTitulo })
    }
    const errorContenido = validadores.validarContenido(contenido)
    if (errorContenido) {
        return res.status(400).json({ error: errorContenido })
    }
    const errorUsuarioId = validadores.validarUsuarioId(usuario_id)
    if (errorUsuarioId){
        return res.status(400).json({error: errorUsuarioId})
    }
    
    try {
        const result = await pool.query(
            'INSERT INTO posts (titulo, contenido, usuario_id) VALUES ($1, $2, $3) RETURNING *',
            [titulo, contenido, usuario_id]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error creando post:', error)
        if (error.code === '23503') {
            return res.status(404).json({ error: 'El usuario especificado no existe' })
        }
        res.status(500).json({ error: 'Error creando post' })
    }
})


router.put('/:id', async function(req, res){
    const { titulo, contenido } = req.body
    try {
        const result = await pool.query(
            'UPDATE posts SET titulo = COALESCE($1, titulo), contenido = COALESCE($2, contenido) WHERE id = $3 RETURNING *',
            [titulo, contenido, req.params.id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado' })
        }
        res.json(result.rows[0])
    } catch (error) {
        console.error('Error actualizando post:', error)
        res.status(500).json({ error: 'Error actualizando post' })
    }
})


router.delete('/:id', async function(req, res){
    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id])
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Post no encontrado' })
        }
        res.json({ mensaje: 'Post eliminado correctamente' })
    } catch (error) {
        console.error('Error eliminando post:', error)
        res.status(500).json({ error: 'Error eliminando post' })
    }
})

module.exports = router