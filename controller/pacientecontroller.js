const { response } = require("express");
//const dbConnection = require('../database/conecta');
const PacienteModel = require('../models/paciente');

const {QueryTypes} = require('sequelize');

const getPacientes = async (req, resp=response) => {
    const pacientes = await
        PacienteModel.sequelize.query(
            "select * from pacientes",
            {type:QueryTypes.SELECT}
        );
    resp.json(pacientes);
}

const getPaciente= async (req, resp = response) => {
    const cve = req.params.cve;
    //const {cve} = req.params;
    const paciente = await PacienteModel.findByPk(cve);
    if (paciente==null){
        resp.json({
            respuesta: false,
            resultado:"No se encuentra"
        });
    }
    else{
        resp.json(paciente); 
    }
}

const postPaciente = async (req, resp = response) => {
    const {body} = req;
    const pacienteParam = {
        Id_paciente: body.Id_paciente,
        Ocupacion   : body.Ocupacion,
        Fecha_registro   : body.Fecha_registro
    };
    try{
        const paciente = await 
            PacienteModel.sequelize.query(
                "INSERT INTO paciente (Id_paciente, Ocupacion, Fecha_registro) VALUES(:paramId_paciente, :paramOcupacion, :paramFecha_registro)",
{
    replacements:{
        paramId_paciente:pacienteParam.Id_paciente,
        paramOcupacion:pacienteParam.Ocupacion,
        paramFecha_registro:pacienteParam.Fecha_registro
    }
}
        );

        const pacienteR = await PacienteModel.findByPk(paciente[0]);

        resp.json(pacienteR);

    }
    catch(error){
        console.log(error);
    }
    
}
const putPaciente = async (req, resp = response) => {
        const { cve } = req.params;
        const { body } = req;
    
        try {
            const updatedRows = await PacienteModel.sequelize.query(
                'UPDATE paciente SET Ocupacion = :ocupacion, Fecha_registro = :fecha_registro WHERE Id_paciente = :cve',
                {
                    replacements: {
                        cve: cve,
                        ocupacion: body.Ocupacion,
                        fecha_registro: body.Fecha_registro
                    },
                    type: PacienteModel.sequelize.QueryTypes.UPDATE,
                }
            );
    
            if (updatedRows[1] === 0) {
                return resp.status(404).json({
                    mensaje: "No se encuentra el registro"
                });
            }
    
            // Obtén el registro actualizado (opcional)
            const updatedPaciente = await PacienteModel.findByPk(cve);
    
            resp.json(updatedPaciente);
        } catch (error) {
            console.log(error);
            resp.status(500).json({
                mensaje: "Error interno del servidor"
            });
        }    
}

const deletePaciente = async (req, resp = response) => {
    
    const {cve} = req.params;
    try{
        const paciente = await PacienteModel.findByPk(cve);
        if (!paciente){
            return resp.status(404).json({
                mensaje: "Registro no encontrado"
            });
        }
        //eliminación física
        //await materia.destroy();
        //eliminación lógica
        await paciente.update({estadoPaciente:false});
        resp.json(paciente);
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    getPacientes,
    getPaciente,
    postPaciente,
    putPaciente,
    deletePaciente
}