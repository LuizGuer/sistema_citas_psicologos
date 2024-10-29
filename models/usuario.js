const { DataTypes } = require('sequelize');

const db = require('../database/conecta');

const usuario = db.define('usuario',{
    Id_usuarios:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Nombre:{
        type: DataTypes.STRING,
    },
    Apellido_p: {
        type: DataTypes.STRING,
    },
    Apellido_m: {
        type: DataTypes.STRING,
    },
    Telefono: {
        type: DataTypes.STRING,
    },
    Correo: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
});


module.exports = usuario;
