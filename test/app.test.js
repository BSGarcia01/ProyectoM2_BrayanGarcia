
const { loadEnvFile } = require('node:process')
loadEnvFile('.env')


const test = require('node:test')
const assert = require('node:assert')
const request = require('supertest')
const app = require('../app')

test('test de usuarios', async function() {
    const respuesta = await request(app).get('/usuarios')
    assert.strictEqual(respuesta.status, 200)
    assert.strictEqual(Array.isArray(respuesta.body), true)
    assert.strictEqual(respuesta.body.length, 3)
})

test('test de verificaccion', async function() {
    const respuesta = await request(app).post('/usuarios').send({nombre: 'Isidro', email: 'isidro@gmail.com'})
    assert.strictEqual(respuesta.status, 201)
})

test('test de validacion de email', async function () {
    const respuesta = await request(app).post('/usuarios').send({nombre:'Brian', email: 'brian@gmail.com'})
    assert.strictEqual(respuesta.status, 409)
})

test('test de posts', async function() {
    const respuesta = await request(app).get('/posts')
    assert.strictEqual(respuesta.status, 200)
    assert.strictEqual(Array.isArray(respuesta.body), true)
    assert.strictEqual(respuesta.body.length, 3)
})

test('test de posts, usuarios', async function() {
    const respuesta = await request(app).post('/posts').send({titulo: 'Hola Mundo', contenido: 'Esto es solo para el test', usuario_id: 1})
    assert.strictEqual(respuesta.status, 201)
    
})

test('test de posts, error', async function() {
    const respuesta = await request(app).post('/posts').send({titulo: 'carros', contenido: 'hace un mes no se venden los mismo 100 carros de siempre', usuario_id:89})
    assert.strictEqual(respuesta.status, 404)
})