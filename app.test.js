const request = require('supertest');
const app = require('./app'); 
const bcrypt = require('bcrypt');
const ModelUser = require('./userModel');

describe('Testeo de endpoints', () => {
    beforeAll(async () => {
        await require('./config')(); 
    });

    it('Debería responder con un código 201 y un mensaje de éxito al registrar un nuevo usuario', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'usuarioDePrueba',
                email: 'usuario@example.com',
                password: 'passwordDePrueba',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Usuario creado con éxito.');
        expect(response.body.user.username).toBe('usuarioDePrueba');
    });

    it('Debería iniciar sesión correctamente con credenciales válidas', async () => {
        await request(app)
            .post('/register')
            .send({
                username: 'usuarioDePrueba',
                email: 'usuario@example.com',
                password: 'passwordDePrueba',
            });
    
        const response = await request(app)
            .post('/login')
            .send({
                email: 'usuario@example.com',
                password: 'passwordDePrueba'
            });
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Inicio de sesión exitoso');
        expect(response.body.user.username).toBe('usuarioDePrueba');
    });
    
});