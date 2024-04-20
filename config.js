const mongoose = require('mongoose');
const dbconnect = async () => {
    try {
        await mongoose.connect("mongodb+srv://root:univalle@cluster0.pe6nq66.mongodb.net/naturedex_db")
        console.log("Conexión correcta a la base de datos");
    } catch (error) {
        console.error("Error de conexión a la base de datos:", error.message);
    }
};

module.exports = dbconnect