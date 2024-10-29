const { response } = require("express");
//const dbConnection = require('../database/conecta');
const PsicologoModel = require('../models/psicologo');

const {QueryTypes} = require('sequelize');

const getPsicologos = async (req, resp=response) => {
    const psicologos = await
        PsicologoModel.sequelize.query(
            "select * from psicologo",
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
                "INSERT INTO psicologo (Contraseña, Fecha_contratacion  ) VALUES(:paramContraseña, :paramFecha_contratacion)",
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
                'UPDATE psicologo SET Contraseña = :contraseña, Fecha_contratacion = :fecha_contratacion WHERE Id_psicologo = :cve',
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

module.exports = {
    getPsicologos,
    getPsicologo,
    postPsicologo,
    putPsicologo,
    deletePsicologo
}