const express = require('express');
const dbconnect = require('./config');
const ModelUser = require('./userModel');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

const router = express.Router();
app.use(express.json());
app.use(router);
app.use(cors());

router.get("/",(req, res) => {
    res.send("Nosotras x League of legends la mejor collab")
})

//Login de usuario

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await ModelUser.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        res.status(200).json({ message: "Inicio de sesión exitoso", user: user });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
});

app.listen(3001, () => {
    console.log("El servidor esta corriendo en el puerto 3001")
})


dbconnect();