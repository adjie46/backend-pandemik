const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer');
const http = require('http')
const config = require("./app/config/public.config");
const path = require('path');

let app = express()
let upload = multer();

let corsOptions = {
    origin: "*"
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(upload.array())
app.use('/assets', express.static(__dirname + '/public'));

const db = require("./app/models");
//db.sequelize.sync()
// db.sequelize.sync({
//     force: true
// }).then(() => {
//     console.log("Drop and re-sync db.");
// });

//includeAllRoute
require("./app/routes/role.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);


let startServer = http.createServer(app)
    .listen(config.serverPort)

if (startServer) {
    console.log(`your server is running on port ${config.serverPort}`);
}