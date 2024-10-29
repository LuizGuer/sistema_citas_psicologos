const { response } = require("express");
//const dbConnection = require('../database/conecta');
const CitaModel = require('../models/cita');
const UsuarioModel = require('../models/usuario');
const PacienteModel = require('../models/paciente');

const {QueryTypes} = require('sequelize');

const getCitas = async (req, resp=response) => {
    const citas = await
        CitaModel.sequelize.query(
            "select * from cita",
            {type:QueryTypes.SELECT}
        );
    resp.json(citas);
}

const getCita= async (req, resp = response) => {
    const cve = req.params.cve;
    //const {cve} = req.params;
    const cita = await CitaModel.findByPk(cve);
    if (cita==null){
        resp.json({
            respuesta: false,
            resultado:"No se encuentra"
        });
    }
    else{
        resp.json(cita); 
    }
}

const postCita = async (req, resp = response) => {
    const {body} = req;
    const citaParam = {
        Id_cita: body.Id_cita,
        Id_paciente   : body.Id_paciente,
        Id_psicologo   : body.Id_psicologo,
        Tratamiento : body.Tratamiento,
        Tipo: body.Tipo,
        Hora_inicio: body.Hora_inicio,
        Hora_fin: body.Hora_fin,
        Estatus: body.Estatus,
        Notas: body.Notas
    };
    try{
        const cita = await 
            CitaModel.sequelize.query(
                "INSERT INTO cita (Id_paciente, Id_psicologo, Tratamiento, Tipo, Hora_inicio, Estatus, Notas) VALUES(:paramId_paciente, :paramId_psicologo, :paramTratamiento, :paramTipo, :paramHora_inicio, :paramEstatus, :paramNotas)",
{
    replacements:{
        paramId_paciente:citaParam.Id_paciente,
        paramId_psicologo:citaParam.Id_psicologo,
        paramTratamiento: citaParam.Tratamiento,
        paramTipo: citaParam.Tipo,
        paramHora_inicio: citaParam.Hora_inicio,
        paramEstatus:citaParam.Estatus,
        paramNotas:citaParam.Notas
    }
}
        );

        const citaR = await CitaModel.findByPk(cita[0]);

        resp.json(citaR);

    }
    catch(error){
        console.log(error);
    }
    /*
    const {cve} = req.params;
    const {body} = req;
    const materiaParam = {
        nombreMateria   : body.nombreMateria,
        estadoMateria   : body.estadoMateria,
        semestreMateria : body.semestreMateria
    };
    try{
        const materia = await MateriaModel.create(
            materiaParam
        );
        resp.json(materia);
    }
    catch(error){
        console.log(error);
        resp.status(500).json(
            {mensaje: "Error en el servidor"}
            );
    }c
    */
    /*
    resp.json({
        respuesta:true,
        mensaje: 'Llamada a post - insertar',
        body
    });
    */
}
const putCita = async (req, resp = response) => {
        const { cve } = req.params;
        const { body } = req;
    
        try {
            const updatedRows = await CitaModel.sequelize.query(
                'UPDATE cita SET Id_paciente = :id_paciente, Id_psicologo = :id_psicologo, Tratamiento = :tratamiento, Tipo = :tipo, Hora_inicio = :hora_inicio, Estatus = :estatus, Notas = :notas WHERE Id_cita = :cve',
                {
                    replacements: {
                        cve: cve,
                        id_paciente: body.Id_paciente,
                        id_psicologo: body.Id_psicologo,
                        tratamiento: body.Tratamiento,
                        tipo: body.Tipo,
                        hora_inicio: body.Hora_inicio,
                        estatus: body.Estatus,
                        notas: body.Notas
                    },
                    type: CitaModel.sequelize.QueryTypes.UPDATE,
                }
            );
    
            if (updatedRows[1] === 0) {
                return resp.status(404).json({
                    mensaje: "No se encuentra el registro"
                });
            }
    
            // Obtén el registro actualizado (opcional)
            const updatedCita = await CitaModel.findByPk(cve);
    
            resp.json(updatedCita);
        } catch (error) {
            console.log(error);
            resp.status(500).json({
                mensaje: "Error interno del servidor"
            });
        }    
}

const deleteCita = async (req, resp = response) => {
    
    const {cve} = req.params;
    try{
        const cita = await CitaModel.findByPk(cve);
        if (!cita){
            return resp.status(404).json({
                mensaje: "Registro no encontrado"
            });
        }
        //eliminación física
        //await materia.destroy();
        //eliminación lógica
        await cita.update({estadoCita:false});
        resp.json(cita);
    }
    catch(error){
        console.log(error);
    }
}




const agendarCita = async (req, resp = response) => {
    const { Nombre, Apellido_p, Apellido_m, Telefono, Correo, Ocupacion, Fecha_registro, Id_psicologo, Tratamiento, Tipo, Hora_inicio, Estatus, Notas } = req.body;

    try {
        // Paso 1: Insertar en la tabla `usuarios`
        const nuevoUsuario = await UsuarioModel.create({
            Nombre,
            Apellido_p,
            Apellido_m,
            Telefono,
            Correo
        });
        console.log("AQUIIII")
        console.log(nuevoUsuario); // Verifica aquí
        const usuarioId = nuevoUsuario.Id_usuarios; // Rescata el ID del usuario recién insertado

        // Paso 2: Insertar en la tabla `pacientes` con el ID del usuario
        const nuevoPaciente = await PacienteModel.create({
            Id_paciente: usuarioId, // Asigna el ID del usuario como ID del paciente
            Ocupacion,
            Fecha_registro
        });
        const pacienteId = nuevoPaciente.Id_paciente; // Rescata el ID del paciente recién insertado

        // Paso 3: Insertar en la tabla `citas` con el ID del paciente
        const nuevaCita = await CitaModel.create({
            Id_paciente: pacienteId, // Asigna el ID del paciente a la cita
            Id_psicologo,
            Tratamiento,
            Tipo,
            Hora_inicio,
            Estatus,
            Notas
        });

        // Retornar una respuesta con los datos de la cita
        resp.json({
            mensaje: 'Cita agendada con éxito',
            usuario: nuevoUsuario,
            paciente: nuevoPaciente,
            cita: nuevaCita
        });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            mensaje: "Error interno al agendar la cita"
        });
    }
};


module.exports = {
    getCitas,
    getCita,
    postCita,
    putCita,
    deleteCita,
    agendarCita
}