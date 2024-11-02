const { response } = require("express");
//const dbConnection = require('../database/conecta');
const UsuarioModel = require('../models/usuario')
const PsicologoModel = require('../models/psicologo');

const {QueryTypes} = require('sequelize');
const psicologo = require("../models/psicologo");

const getPsicologos = async (req, resp=response) => {
    const psicologos = await
        PsicologoModel.sequelize.query(
            "select * from psicologos",
            {type:QueryTypes.SELECT}
        );
    resp.json(psicologos);
}

const getPsicologo= async (req, resp = response) => {
    const cve = req.params.cve;
    //const {cve} = req.params;
    const psicologo = await PsicologoModel.findByPk(cve);
    if (psicologo==null){
        resp.json({
            respuesta: false,
            resultado:"No se encuentra"
        });
    }
    else{
        resp.json(psicologo); 
    }
}

const postPsicologo = async (req, resp = response) => {
    const {body} = req;
    const psicologoParam = {
        Id_psicologo: body.Id_psicologo,
        Contraseña   : body.Contraseña,
        Fecha_contratacion   : body.Fecha_contratacion,
    };
    try{
        const psicologo = await 
            PsicologoModel.sequelize.query(
                "INSERT INTO psicologos (Contraseña, Fecha_contratacion  ) VALUES(:paramContraseña, :paramFecha_contratacion)",
{
    replacements:{
        paramContraseña:psicologoParam.Contraseña,
        paramFecha_contratacion:psicologoParam.Fecha_contratacion,
    }
}
        );

        const psicologoR = await PsicologoModel.findByPk(psicologo[0]);

        resp.json(psicologoR);

    }
    catch(error){
        console.log(error);
    }
}
const putPsicologo = async (req, resp = response) => {
        const { cve } = req.params;
        const { body } = req;
    
        try {
            const updatedRows = await PsicologoModel.sequelize.query(
                'UPDATE psicologos SET Contraseña = :contraseña, Fecha_contratacion = :fecha_contratacion WHERE Id_psicologo = :cve',
                {
                    replacements: {
                        cve: cve,
                        contraseña: body.Contraseña,
                        fecha_contratacion: body.Fecha_contratacion
                    },
                    type: PsicologoModel.sequelize.QueryTypes.UPDATE,
                }
            );
    
            if (updatedRows[1] === 0) {
                return resp.status(404).json({
                    mensaje: "No se encuentra el registro"
                });
            }
    
            // Obtén el registro actualizado (opcional)
            const updatedPsicologo = await PsicologoModel.findByPk(cve);
    
            resp.json(updatedPsicologo);
        } catch (error) {
            console.log(error);
            resp.status(500).json({
                mensaje: "Error interno del servidor"
            });
        }    
}

const deletePsicologo = async (req, resp = response) => {
    
    const {cve} = req.params;
    try{
        const psicologo = await PsicologoModel.findByPk(cve);
        if (!psicologo){
            return resp.status(404).json({
                mensaje: "Registro no encontrado"
            });
        }
        //eliminación física
        //await materia.destroy();
        //eliminación lógica
        await psicologo.update({estadoPsicologo:false});
        resp.json(psicologo);
    }
    catch(error){
        console.log(error);
    }
}

const getPsicologoVista = async (req, resp=response) => {
    try {
        const psicologos = await
        PsicologoModel.sequelize.query(
            "SELECT usuarios.Id_usuarios AS Id_psicologo, usuarios.Nombre, usuarios.Apellido_p, usuarios.Apellido_m FROM psicologos JOIN usuarios ON psicologos.Id_psicologo = usuarios.Id_usuarios;",
            {type:QueryTypes.SELECT}
        );

        resp.json(psicologos);
    } catch (error) {
        console.error("Error al obtener psicólogos:", error);
        resp.status(500).json({ error: "Error al obtener la lista de psicólogos" });
    }
}

//agregar información psicólogo 

const registrarPsicologo = async (req, resp = response) => {
    const { Nombre, Apellido_p, Apellido_m, Telefono, Correo, Contraseña, Fecha_contratacion} = req.body;

    try {
        // Paso 1: Insertar en la tabla usuarios
        const nuevoUsuario= await UsuarioModel.create({
            Nombre,
            Apellido_p,
            Apellido_m,
            Telefono,
            Correo
        });
        
        const usuarioId = nuevoUsuario.Id_usuarios; // Rescata el ID del usuario recién insertado

        // Paso 2: Insertar en la tabla psicologo con el ID del usuario
        const nuevoPsicologo = await PsicologoModel.create({
            Id_psicologo: usuarioId, // Asigna el ID del usuario como ID del paciente
            Contraseña,
            Fecha_contratacion
        });
        

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            mensaje: "Error interno al agregar información"
        });
    }
};

module.exports = {
    getPsicologos,
    getPsicologo,
    postPsicologo,
    putPsicologo,
    deletePsicologo,
    getPsicologoVista,
    registrarPsicologo
}