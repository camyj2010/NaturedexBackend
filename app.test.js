const request = require('supertest');
const app = require('./app'); 
const bcrypt = require('bcrypt');
const ModelUser = require('./userModel');

describe('Testeo de endpoints', () => {

    let testUser = {
        username: 'usuarioDePrueba',
        email: 'usuario@example.com',
        password: 'passwordDePrueba',
    }
    let testUserForDelete;

    beforeAll(async () => {
        await require('./config')(); 
    });

        
    afterEach(async () => {
        
        if (testUserForDelete) {
            console.log(testUserForDelete)
            await ModelUser.findOneAndDelete({email : testUserForDelete.email});
        }
        
    });

    it('Debería responder con un código 201 y un mensaje de éxito al registrar un nuevo usuario', async () => {
        const response = await request(app)
            .post('/register')
            .send(testUser);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Usuario creado con éxito.');
        expect(response.body.user.username).toBe('usuarioDePrueba');
    });

    it('Debería iniciar sesión correctamente con credenciales válidas', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Inicio de sesión exitoso');
    });

    it('Debería agregar una nueva imagen al registro del usuario y devolver la respuesta esperada', async () => {
        const user = await ModelUser.findOne({ email:testUser.email })
        const user_id = user._id
        const response = await request(app)
            .post('/picture')
            .send({
                id:user_id.toString(),
                link:'https://humanidades.com/wp-content/uploads/2017/02/perro-1-e1561678907722.jpg'
            })
        expect(response.status).toBe(200);
        const updatedUser = await ModelUser.findById(user_id.toString());
        expect(updatedUser.record.length).toBeGreaterThan(0); 
        
        testUserForDelete = testUser
    });

    
});