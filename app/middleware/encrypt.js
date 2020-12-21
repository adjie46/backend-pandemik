
const CryptoJS = require("crypto-js");
const JsFormat = require("./jsonFormater");
const config = require('../config/public.config');
const { json } = require("body-parser");

function encrypt(data){
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), config.encryptedCode, {
        format: JsFormat.JsonFormatter
    }).toString();
    return (encrypted);
}

module.exports = encrypt