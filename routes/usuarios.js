
const express = require('express')
const router = express.Router()
const pool = require('../db/config')
const validadores = require('../validators/usuarios')


router.get('/', async function(req, res){
    try {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY id')
        res.json(result.rows)
    } catch (error) {
        console.error('Error obteniendo usuarios:', error)
        res.status(500).json({ error: 'Error obteniendo usuarios' })
    }
})


router.get('/:id', async function(req, res){
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.params.id])
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }
        res.json(result.rows[0])
    } catch (error) {
        console.error('Error obteniendo usuario:', error)
        res.status(500).json({ error: 'Error obteniendo usuario' })
    }
})


router.post('/', async function(req, res){
    const {nombre, email} = req.body

    const errorNombre = validadores.validarNombre(nombre)
    if (errorNombre) {
        return res.status(400).json({ error: errorNombre})
    }
    const errorEmail = validadores.validarEmail(email)
    if(errorEmail){
        return res.status(400).json({ error: errorEmail})
    }
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *',
            [nombre, email]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error creando usuario:', error)
        if (error.code === '23505') {
            return res.status(409).json({ error: 'El email ya está registrado' })
        }
        res.status(500).json({ error: 'Error creando usuario' })
    }
})


router.put('/:id', async function(req, res){
    const { nombre, email } = req.body
    try {
        const result = await pool.query(
            'UPDATE usuarios SET nombre = COALESCE($1, nombre), email = COALESCE($2, email) WHERE id = $3 RETURNING *',
            [nombre, email, req.params.id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }
        res.json(result.rows[0])
    } catch (error) {
        console.error('Error actualizando usuario:', error)
        if (error.code === '23505') {
            return res.status(409).json({ error: 'El email ya está registrado' })
        }
        res.status(500).json({ error: 'Error actualizando usuario' })
    }
})


router.delete('/:id', async function(req, res){
    try {
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [req.params.id])
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }
        res.json({ mensaje: 'Usuario eliminado correctamente' })
    } catch (error) {
        console.error('Error eliminando usuario:', error)
        res.status(500).json({ error: 'Error eliminando usuario' })
    }
})

module.exports = router
