var express = require('express');

var app = express();

const path = require('path');

const fs = require('fs');


//Rutas

app.get('/:tipo/:imagen', (req, res, next) => {

    var tipo = req.params.tipo;
    var imagen = req.params.imagen;


    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${imagen}`);


    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }
});

module.exports = app;