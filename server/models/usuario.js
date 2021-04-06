const Sequelize = require('sequelize');

const db = require('../config/database');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}


const usuarioSchema = db.define('usuarios', {
    usuario: {
        type: Sequelize.STRING,
        required: [true, 'el nombre es necesario'],
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        required: [true, 'el correo Electronico es necesario'],
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        required: [true, 'la contraseña es necesario']
    },
    img: {
        type: Sequelize.STRING,
        required: false
    },
    role: {
        type: Sequelize.STRING,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Sequelize.BOOLEAN,
        default: true
    }
})

usuarioSchema.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

module.exports = usuarioSchema;