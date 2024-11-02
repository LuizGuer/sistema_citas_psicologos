const { response } = require("express");
//const dbConnection = require('../database/conecta');
const ServicioModel = require('../models/servicio');

const {QueryTypes} = require('sequelize');

const getServicios = async (req, resp=response) => {
    const servicios = await
        ServicioModel.sequelize.query(
            "select * from servicios",
            {type:QueryTypes.SELECT}
        );
    resp.json(servicios);
}

const getServicioVista = async (req, resp=response) => {
    const idPsicologo = req.params.idPsicologo;
    try {
        const tratamientos = await ServicioModel.sequelize.query(
            "SELECT servicios.Id_servicio AS Id_servicio, servicios.Tratamiento AS Tratamiento FROM servicios JOIN psicologos ON psicologos.Id_psicologo = servicios.Id_psicologo WHERE psicologos.Id_psicologo = ?",
            {
                replacements: [idPsicologo],
                type: QueryTypes.SELECT
            }
        );

        resp.json(tratamientos);
    } catch (error) {
        console.error("Error al obtener tratamientos:", error);
        resp.status(500).json({ error: "Error al obtener la lista de tratamientos" });
    }
}

const getServicio = async (req, resp = response) => {
    const cve = req.params.cve;
    //const {cve} = req.params;
    const servicio = await ServicioModel.findByPk(cve);
    if (servicio==null){
        resp.json({
            respuesta: false,
            resultado:"No se encuentra xdxd"
        });
    }
    else{
        resp.json(servicio); 
    }
}

const postServicio = async (req, resp = response) => {
    const {body} = req;
    const servicioParam = {
        Id_servicio: body.Id_servicio,
        Id_psicologo   : body.Id_psicologo,
        Tratamiento   : body.Tratamiento,
        Costo: body.Costo,
    };
    try{
        const servicio = await 
            ServicioModel.sequelize.query(
                "INSERT INTO servicios (Id_psicologo, Tratamiento, Costo  ) VALUES(:paramId_psicologo, :paramTratamiento, :paramCosto)",
{
    replacements:{
        paramId_psicologo:servicioParam.Id_psicologo,
        paramTratamiento:servicioParam.Tratamiento,
        paramCosto:servicioParam.Costo,
    }
}
        );

        const servicioR = await ServicioModel.findByPk(servicio[0]);

        resp.json(servicioR);

    }
    catch(error){
        console.log(error);
    }
}
const putServicio = async (req, resp = response) => {
        const { cve } = req.params;
        const { body } = req;
    
        try {
            const updatedRows = await ServicioModel.sequelize.query(
                'UPDATE servicios SET Id_psicologo = :id_psicologo, Tratamiento = :tratamiento, Costo = :costo WHERE Id_servicio = :cve',
                {
                    replacements: {
                        cve: cve,
                        id_psicologo: body.Id_psicologo,
                        tratamiento: body.Tratamiento,
                        costo: body.Costo
                    },
                    type: ServicioModel.sequelize.QueryTypes.UPDATE,
                }
            );
    
            if (updatedRows[1] === 0) {
                return resp.status(404).json({
                    mensaje: "No se encuentra el registro"
                });
            }
    
            // Obtén el registro actualizado (opcional)
            const updatedServicio = await ServicioModel.findByPk(cve);
    
            resp.json(updatedServicio);
        } catch (error) {
            console.log(error);
            resp.status(500).json({
                mensaje: "Error interno del servidor"
            });
        }    
}

const deleteServicio = async (req, resp = response) => {
    
    const {cve} = req.params;
    try{
        const servicio = await ServicioModel.findByPk(cve);
        if (!servicio){
            return resp.status(404).json({
                mensaje: "Registro no encontrado"
            });
        }
        //eliminación física
        //await materia.destroy();
        //eliminación lógica
        await servicio.update({estadoServicio:false});
        resp.json(servicio);
    }
    catch(error){
        console.log(error);
    }
}



module.exports = {
    getServicios,
    getServicio,
    postServicio,
    putServicio,
    deleteServicio,
    getServicioVista
}