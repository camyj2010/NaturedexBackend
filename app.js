const express = require('express');
const dbconnect = require('./config');
const ModelUser = require('./userModel')
const cors = require('cors');
const app = express();

const router = express.Router();

router.get("/",(req, res) => {
    res.send("Nosotras x League of legends la mejor collab")
})

app.listen(3001, () => {
    console.log("El servidor esta corriendo en el puerto 3001")
})

app.use(express.json());
app.use(router);
app.use(cors());
dbconnect();