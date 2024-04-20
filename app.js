const express = require('express');
const dbconnect = require('./config');
const ModelUser = require('./userModel')
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

const router = express.Router();

router.get("/",(req, res) => {
    res.send("Nosotras x League of legends la mejor collab")
})

// CREAR UN USUARIO ( REGISTRO )

router.post("/register", async (req, res) => {
    try {
      const { username, email, password, record } = req.body;
  
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await ModelUser.create({
        username,
        email,
        password: hashedPassword,
        record
      });
      res.status(201).json({ message: "Usuario creado con éxito.", user: newUser });
    } catch (error) {
      console.error('Error al registrar nuevo usuario:', error);
      res.status(500).json({ message: "Error al registrar nuevo usuario." });
    }
  });

app.listen(3001, () => {
    console.log("El servidor esta corriendo en el puerto 3001")
})

app.use(express.json());
app.use(router);
app.use(cors());
dbconnect();