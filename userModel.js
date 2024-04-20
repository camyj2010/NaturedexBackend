const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        record: {
            type: [
                [String, String, String]
            ]
        }
    },
    {
        versionKey: false
    }
)

const ModelUser = mongoose.model("users", userSchema);
module.exports = ModelUser