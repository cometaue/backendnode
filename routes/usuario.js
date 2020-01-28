const express = require('express');
const jwt = require('jsonwebtoken');
/* var SEED = require('../config/config').SEED; */
var mdAutentificacion = require('../middlewares/autentificacion');
//bcrypt
const bcrypt = require('bcrypt');

let app = express();

// improtamos los modelos
var Usuario = require('../models/usuario');

// obtener los datos
app.get('/', (req, res) => {
  Usuario.find({}, 'nombre email role img').exec((err, users) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error cargando usuarios',
        errors: err
      });
    }
    res.status(200).json({
      ok: true,
      users
    });
  });
});

//actualizar los datos
app.put('/:id', (req, res) => {
  var id = req.params.id;
  var body = req.body;
  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Usuario no valido',
        errors: err
      });
    }
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: `EL usuario con el id: ${id} no existe`,
        errors: { message: 'No existe un usuario con ese ID' }
      });
    }
    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar el usuario',
          errors: err
        });
      }
      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });
  });
});

//guardar los datos
app.post('/', mdAutentificacion.verificarToken, (req, res) => {
  var body = req.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10), //encriptar contraseña
    img: body.img,
    role: body.role
  });
  //guardamos en la base de datos
  usuario.save((err, userSave) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error guardando usuario',
        errors: err
      });
    }
    res.status(201).json({
      ok: true,
      usuario: userSave,
      usuariotoken: req.usuario
    });
  });
});

//Delete Usuario

app.delete('/:id', (req, res) => {
  var id = req.params.id;
  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar el usuario',
        errors: err
      });
    }
    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    });
  });
});

module.exports = app;
