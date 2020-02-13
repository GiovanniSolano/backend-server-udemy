var express = require('express');

const fileUpload = require('express-fileupload');


var app = express();

var fs = require('fs');

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');


// default options
app.use(fileUpload());




//Rutas

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Tipos de colección

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(500).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'Tipo de colección no es válida' }
        });

    }

    if (!req.files) {

        return res.status(500).json({
            ok: false,
            mensaje: 'No se subió el archivo',
            errors: { message: 'Debe de seleccionar una imagen' }
        });

    }

    // Obtener nombre archivo

    var archivo = req.files.imagen;

    var nombreCortado = archivo.name.split('.');

    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Sólo estas extensiones

    var extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesPermitidas.indexOf(extensionArchivo) < 1) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'La extensión no es soportada' }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo del temporal a un path

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });

        }





        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     nombreCortado: extensionArchivo
        // });

        subirPorTipo(tipo, id, nombreArchivo, res);



    });
});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo == 'usuarios') {


        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no encontrado',
                    errors: { message: 'Usuario no existe' }
                });

            }
            var pathViejo = './uploads/usuarios/' + usuario.imagen;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al eliminar imagen anterior',
                            path: pathViejo
                        });
                    }
                });
            }

            usuario.imagen = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':]';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });


        });

    }
    if (tipo == 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'medico no encontrado',
                    errors: { message: 'medico no existe' }
                });

            }

            var pathViejo = './uploads/medicos/' + medico.imagen;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al eliminar imagen anterior',
                            path: pathViejo
                        });
                    }
                });
            }

            medico.imagen = nombreArchivo;

            medico.save((err, medicoActualizado) => {


                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });

            });


        });

    }
    if (tipo == 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'hospital no encontrado',
                    errors: { message: 'hospital no existe' }
                });

            }

            var pathViejo = './uploads/hospitales/' + hospital.imagen;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al eliminar imagen anterior',
                            path: pathViejo
                        });
                    }
                });
            }

            hospital.imagen = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {


                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });

            });


        });

    }



}

module.exports = app;