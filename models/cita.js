const { DataTypes } = require('sequelize');

const db = require('../database/conecta');

const cita = db.define('cita',{
    Id_cita:{
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    Id_paciente:{
        type: DataTypes.INTEGER,
    },
    Id_psicologo: {
        type: DataTypes.INTEGER,
    },
    Tratamiento: {
        type: DataTypes.STRING,
    },
    Hora_inicio: {
        type: DataTypes.STRING,
    },
    Hora_inicio: {
        type: DataTypes.TIME,
    },
    Estatus: {
        type: DataTypes.STRING,
    },
    Notas: {
        type: DataTypes.STRING
    },
    Dia:{
        type: DataTypes.STRING,
    }
}, {
    timestamps: false,
});


module.exports = cita;
