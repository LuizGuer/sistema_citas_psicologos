const { DataTypes } = require('sequelize');

const db = require('../database/conecta');

const horario = db.define('horario',{
    Id_horario :{
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    Id_psicologo:{
        type: DataTypes.INTEGER,
    },
    Dia: {
        type: DataTypes.STRING,
    },
    Hora_inicio: {
        type: DataTypes.TIME,
    },
    Hora_final: {
        type: DataTypes.TIME,
    }
}, {
    timestamps: false,
});


module.exports = horario;
