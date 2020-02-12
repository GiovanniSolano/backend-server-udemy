var express = require('express');

var app = express();

var bcrypt = require('bcryptjs');

var SEED = require('../config/config').SEED;

var jwt = require('jsonwebtoken');

var middleware = require('../middlewares/autenticacion').verificaToken;

var Usuario = require('../models/usuario');

//Rutas, Obtener todos los usuarios

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email imagen role').exec(
        (err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });

        });

});


//Rutas, Actualizar usuario

app.put('/:id', middleware, (req, res) => {

    var id = req.params.id;

    var body = req.body;



    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no existe',
                errors: { message: 'No existe usuario' }
            });

        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });


        });

    });




});


//Rutas, Crear nuevo usuario
app.post('/', middleware, (req, res) => {

    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        imagen: body.imagen,
        role: body.role
    });
    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });



    });

});


// borrar usuario


app.delete('/:id', middleware, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }


        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });



    });

});

module.exports = app;