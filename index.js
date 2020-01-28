var colors = require('colors');
const express = require('express');
const mongo = require('mongoose');
mongo.set('useCreateIndex', true);
//bodyparser
var bodyParser = require('body-parser');
//improtaciones de las rutas
const home = require('./routes/home');
const usuario = require('./routes/usuario');
const login = require('./routes/login');
//variables
let app = express();

//bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//coneccion a la moongose
mongo
  .connect('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB Conectada'.magenta))
  .catch(err => console.log(err));

// definimos nuestras rutas
app.use('/login', login);
app.use('/usuario', usuario);
app.use('/', home);

// inicialización del servidor de express
app.listen('3000', () =>
  console.log('express corriendo en el puerto 3000'.yellow)
);
