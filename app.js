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

  // Función para agregar un enlace al primer elemento del campo "record" del usuario
router.post("/picture", async (req, res) => {
  try {
      const { id, link } = req.body;
      
      // Verifica si se proporciona el ID y el enlace
      if (!id || !link) {
          return res.status(400).json({ message: "Se requiere proporcionar un ID de usuario y un enlace" });
      }
      
      // Encuentra al usuario por su ID
      const user = await ModelUser.findById(id);

      // Si no se encuentra al usuario, devuelve un error
      if (!user) {
          return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Agrega el enlace al principio del array "record"
      user.record.unshift({ link });

      // Guarda los cambios en la base de datos
      await user.save();

      res.status(200).json({ message: "Enlace agregado exitosamente al usuario", user: user });
  } catch (error) {
      console.error('Error al agregar enlace al usuario:', error);
      res.status(500).json({ message: "Error al agregar enlace al usuario" });
  }
});


app.listen(3001, () => {
    console.log("El servidor esta corriendo en el puerto 3001")
})


dbconnect();