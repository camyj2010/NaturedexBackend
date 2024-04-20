const request = require('supertest');
const app = require('./app'); 

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
                record: [["Link animal","Nombre animal","Informacion animal"]]
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Usuario creado con éxito.');
        expect(response.body.user.username).toBe('usuarioDePrueba');
        // Agrega más expectativas según sea necesario
    });

    // Agrega más pruebas aquí
});