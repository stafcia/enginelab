const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');

//==========================
//Verificar token
//=========================

let verificaToken = (req, res, next) => {
    //let token = req.query.token ? req.query.token : req.get('token');

    let token = req.body.token || req.query.token || req.cookies.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.redirect('/?m=token no valido');
            /* return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            }) */
        }

        req.usuario = decoded.usuario;

        next();

    });

};

//==========================
//Verificar admin rol
//=========================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};


module.exports = { verificaToken, verificaAdminRole };