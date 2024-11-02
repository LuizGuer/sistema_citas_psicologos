const { DataTypes } = require('sequelize');

const db = require('../database/conecta');

const servicio = db.define('servicio',{
    Id_servicio:{
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    Id_psicologo:{
        type: DataTypes.INTEGER,
    },
    Tratamiento: {
        type: DataTypes.STRING,
    },
    Costo: {
        type: DataTypes.DECIMAL(10,2),
    }
}, {
    timestamps: false,
});


module.exports = servicio;
