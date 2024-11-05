const { response } = require("express");
//const dbConnection = require('../database/conecta');
const HorarioModel = require('../models/horario');

const {QueryTypes} = require('sequelize');

const getHorarios = async (req, resp=response) => {
    const horarios = await
        HorarioModel.sequelize.query(
            "select * from horarios",
            {type:QueryTypes.SELECT}
        );
    resp.json(horarios);
}

const getHorariosVista = async (req, resp=response) => {
    const idHorario = req.params.idHorario;
    try {
        const horarios = await HorarioModel.sequelize.query(
            "SELECT H.Id_horario AS Id_horario, H.Dia AS Dia, H.Hora_inicio AS Hora_inicio FROM horarios H JOIN psicologos P ON P.Id_psicologo = H.Id_psicologo WHERE P.Id_psicologo = ?",
            {
                replacements: [idHorario],
                type: QueryTypes.SELECT
            }
        );

        resp.json(horarios);
    } catch (error) {
        console.error("Error al obtener horarios:", error);
        resp.status(500).json({ error: "Error al obtener la lista de horarios" });
    }
}



const getHorarioLista = async (req, resp=response) => {
    const idPsicologo = req.params.idPsicologo;
    const Dia = req.params.Dia

    try {
        const horarios = await HorarioModel.sequelize.query(
            "SELECT H.Id_horario, H.Hora_inicio AS Hora_inicio FROM horarios H JOIN psicologos P ON P.Id_psicologo = H.Id_psicologo WHERE P.Id_psicologo = ? AND H.Dia = ?;",
            {
                replacements: [idPsicologo, Dia],
                type: QueryTypes.SELECT
            }
        );
        resp.json(horarios);
    } catch (error) {
        console.error("Error al obtener horarios:", error);
        resp.status(500).json({ error: "Error al obtener la lista de horarios" });
    }
}



///aqui me quede
const getHorario = async (req, resp = response) => {
    const cve = req.params.cve;
    //const {cve} = req.params;
    const horario = await HorarioModel.findByPk(cve);
    if (horario==null){
        resp.json({
            respuesta: false,
            resultado:"No se encuentra"
        });
    }
    else{
        resp.json(horario); 
    }
}

const postHorario = async (req, resp = response) => {
    const {body} = req;
    const horarioParam = {
        Id_horario: body.Id_horario,
        Id_psicologo: body.Id_psicologo,
        Dia   : body.Dia,
        Hora_inicio   : body.Hora_inicio,
        Hora_final: body.Hora_final,
    };
    try{
        const horario = await 
            HorarioModel.sequelize.query(
                "INSERT INTO horarios (Id_psicologo, Dia, Hora_inicio, Hora_final) VALUES(:paramId_psicologo, :paramDia, :paramHora_inicio, :paramHora_final)",
{
    replacements:{
        paramId_psicologo:horarioParam.Id_psicologo,
        paramDia:horarioParam.Dia,
        paramHora_inicio:horarioParam.Hora_inicio,
        paramHora_final:horarioParam.Hora_final
    }
}
        );

        const horarioR = await HorarioModel.findByPk(horario[0]);

        resp.json(horarioR);

    }
    catch(error){
        console.log(error);
    }
}
const putHorario = async (req, resp = response) => {
        const { cve } = req.params;
        const { body } = req;
    
        try {
            const updatedRows = await HorarioModel.sequelize.query(
                'UPDATE horarios SET Id_psicologo = :id_psicologo, Dia = :dia, Hora_inicio = :hora_inicio, Hora_final = :hora_final WHERE Id_horario = :cve',
                {
                    replacements: {
                        cve: cve,
                        id_psicologo: body.Id_psicologo,
                        dia: body.Dia,
                        hora_inicio: body.Hora_inicio,
                        hora_final: body.Hora_final
                    },
                    type: HorarioModel.sequelize.QueryTypes.UPDATE,
                }
            );
    
            if (updatedRows[1] === 0) {
                return resp.status(404).json({
                    mensaje: "No se encuentra el registro"
                });
            }
    
            // Obtén el registro actualizado (opcional)
            const updatedHorario = await HorarioModel.findByPk(cve);
    
            resp.json(updatedHorario);
        } catch (error) {
            console.log(error);
            resp.status(500).json({
                mensaje: "Error interno del servidor"
            });
        }    
}

const deleteHorario = async (req, resp = response) => {
    
    const {cve} = req.params;
    try{
        const horario = await HorarioModel.findByPk(cve);
        if (!horario){
            return resp.status(404).json({
                mensaje: "Registro no encontrado"
            });
        }
        //eliminación física
        //await materia.destroy();
        //eliminación lógica
        await horario.update({estadoHorario:false});
        resp.json(horario);
    }
    catch(error){
        console.log(error);
    }
}



module.exports = {
    getHorarios,
    getHorario,
    postHorario,
    putHorario,
    deleteHorario,
    getHorariosVista,
    getHorarioLista
}