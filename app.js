const express = require('express');
const dbconnect = require('./config');
const ModelUser = require('./userModel');
const bcrypt = require('bcrypt');
const axios = require('axios');
const cors = require('cors');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

const vision = new ImageAnnotatorClient({
  credentials: {
    type: process.env.GOOGLE_CLOUD_TYPE,
    project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
    auth_uri: process.env.GOOGLE_CLOUD_AUTH_URI,
    token_uri: process.env.GOOGLE_CLOUD_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
  },
});
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

        res.status(200).json({ message: "Inicio de sesión exitoso", _id: user._id, username: user.username,  email: user.email, record: user.record });
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


  // Función que recibe un id de usuario y un link a una imagen y utiliza la google cloud vision para extraer caracterisitcas del animal en la
  // imagen y pasar los labels obtenidos a la api de gemini para que esta identifique el animal y retorne una descripcion del mismo
  router.post("/picture", async (req, res) => {
    try {
      const { id, link } = req.body;
  
      // ... code to validate ID and link (unchanged)
  
      const response = await axios.get(link, { responseType: 'arraybuffer' });
      const imageData = Buffer.from(response.data, 'binary');

        // Process image using Google Cloud Vision
      const [result] = await vision.labelDetection(imageData); // Assign value to result

  
      const labels = result.labelAnnotations.map(annotation => annotation.description);
        //
        const API_KEY = process.env.api_key_gemmini;
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({model: "gemini-pro"});
        const prompt= "classified which animal it is depending on the labels entered"+labels;
        const result_g= await model.generateContent(prompt);
        const response_g = await result_g.response;
        const text_animal= response_g.text();

        const prompt_d = "generate a description of the animal depending on which animal it is of maximum 200 characters"+text_animal;
        const result_d = await model.generateContent(prompt_d);
        const response_d = await result_d.response;
        const text_d= response_d.text();
    
        const jsonResponse = {
            animal: text_animal, 
            description: text_d 
          };
        // Enviar la respuesta como JSON al frontend
        const user = await ModelUser.findById({_id:id});
        const record = user.record
        const new_record = [link,text_animal,text_d]
        record.push(new_record)
        const response_new_record = await ModelUser.findOneAndUpdate({_id:id},{record:record}, {new: true})
        res.send(response_new_record)
        //res.status(200).json(jsonResponse);

      // ... code to save changes in the database (unchanged)
  
    
    } catch (error) {
      console.error('Error al agregar etiquetas al usuario:', error);
      res.status(500).json({ message: "Error al agregar etiquetas al usuario" });
    }
  });

  //Funcion que sirve para traer a todos los usuarios

  router.get("/all", async (req,res) => {
    const response = await ModelUser.find({})
    res.send(response)
  })

  //Funcion que sirve para traer a 1 usuario por id

  router.get("/one/:id", async (req,res) =>{
    const id = req.params.id
    const response = await ModelUser.findById(id)
    res.send(response)
  })






// app.listen(3001, () => {
//     console.log("El servidor esta corriendo en el puerto 3001")
// })


module.exports = app;
dbconnect();

