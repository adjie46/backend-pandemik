const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer');
const http = require('http')
const config = require("./app/config/public.config");
const path = require('path');
var hbs = require('hbs');

let app = express()
let upload = multer();

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('ifNotEquals', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});


// let corsOptions = {
//     origin: "localhost:8080"
// }

// app.use(cors(corsOptions))
hbs.registerPartials(__dirname + '/app/view/includes/');

app.set('views', path.join(__dirname, 'app/view/'));
app.disable('views cache');
app.set('view engine', 'hbs');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(upload.array())
app.use('/assets', express.static(__dirname + '/public',{
    etag: false
}));

const db = require("./app/models");
db.sequelize.sync()
// db.sequelize.sync({
//     force: true
// }).then(() => {
//     console.log("Drop and re-sync db.");
// });

//includeAllRoute
require("./app/routes/role.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/jurusan.routes")(app);
require("./app/routes/web/auth.routes")(app);
require("./app/routes/web/dashboard.routes")(app);


let startServer = http.createServer(app)
    .listen(config.serverPort)

if (startServer) {
    console.log(`your server is running on port ${config.serverPort}`);
}