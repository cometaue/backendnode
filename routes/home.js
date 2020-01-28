const express = require('express');
let app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    OK: true,
    mensaje: 'home listo'
  });
});

module.exports = app;
