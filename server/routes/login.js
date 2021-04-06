const express = require('express');
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const Usuario = require('../models/usuario');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');


const app = express();

app.use(cookieParser())

app.post('/login', (req, res) => {
    let body = req.body;

    let objetoLogin = { email: body.email };
    if (!body.email) {
        objetoLogin = { usuario: body.usuario };
    }
    console.log(objetoLogin);
    Usuario.findOne({ where: objetoLogin }).then(usuarioDB => {

        if (!usuarioDB) {

            return res.redirect('/?m="Usuario o contraseña incorrecto"');
            /* res.status(400).json(.json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            }) */


        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.redirect('/?m="Usuario o contraseña incorrecto"');
            /* return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            }); */
        }

        let token = jwt.sign({
            usuario: usuarioDB

        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
        res.cookie('token', token);
        res.redirect('/secureSession/');

    }).catch(err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    })


})


app.get('/', function(req, res) {
    res.render('pages/index');
});


app.get('/closeSession', function(req, res) {
    res.clearCookie("token");
    res.redirect('/');
});

module.exports = app;