// express
const express = require('express');
var colors = require('colors');
//jsonwebtoken
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
//models
var Usuario = require('../models/usuario');

//bcrypt
const bcrypt = require('bcrypt');

let app = express();

app.post('/', (req, res) => {
  var body = req.body;
  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuarios',
        errors: err
      });
    }
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas - email',
        errors: err
      });
    }
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas - password',
        errors: err
      });
    }

    //creacion del token
    usuarioDB.password = '=)';
    var token = jwt.sign({ usuario: usuarioDB }, 'admin123', {
      expiresIn: 10800
    });

    res.status(200).json({
      OK: true,
      usuario: usuarioDB,
      token,
      id: usuarioDB._id
    });
  });
});

module.exports = app;
