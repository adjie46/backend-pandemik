require('dotenv').config()

module.exports = {
    serverPort : process.env.SERVER_PORT,
    encryptedCode : process.env.DECRYPT_CODE,
    JWTSecret: process.env.JWT_SECRET
}