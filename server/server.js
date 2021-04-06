require('./config/config')
const express = require('express');
const socketIO = require('socket.io');


const http = require('http');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

let server = http.createServer(app);

const publicPath = path.resolve(__dirname, '../public');

app.set('view engine', 'ejs');

app.use(express.static(publicPath));
//Index de las rutas
app.use(require('./routes/index'));


server.listen(process.env.PORT, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);

});