const { response } = require("express");
//const dbConnection = require('../database/conecta');
const UsuarioModel = require('../models/usuario');

const {QueryTypes} = require('sequelize');

const getUsuarios = async (req, resp=response) => {
    const usuarios = await
        UsuarioModel.sequelize.query(
            "select * from usuarios",
            {type:QueryTypes.SELECT}
        );
    resp.json(usuarios);
}

const getUsuario= async (req, resp = response) => {
    const cve = req.params.cve;
    //const {cve} = req.params;
    const usuario = await UsuarioModel.findByPk(cve);
    if (usuario==null){
        resp.json({
            respuesta: false,
            resultado:"No se encuentra"
        });
    }
    else{
        resp.json(usuario); 
    }
}

const postUsuario = async (req, resp = response) => {
    const {body} = req;
    const usuarioParam = {
        Id_usuarios: body.Id_usuarios,
        Nombre   : body.Nombre,
        Apellido_p   : body.Apellido_p,
        Apellido_m : body.Apellido_m,
        Telefono: body.Telefono,
        Correo: body.Correo,
        Tipo_usuario: body.Tipo_usuario,
    };
    try{
        const usuario = await 
            UsuarioModel.sequelize.query(
                "INSERT INTO usuario (Nombre, Apellido_p, Apellido_m, Telefono, Correo) VALUES(:paramNombre, :paramApellido_p, :paramApellido_m, :paramTelefono, :paramCorreo)",
{
    replacements:{
        paramNombre:usuarioParam.Nombre,
        paramApellido_p:usuarioParam.Apellido_p,
        paramApellido_m:usuarioParam.Apellido_m,
        paramTelefono:usuarioParam.Telefono,
        paramCorreo:usuarioParam.Correo
    }
}
        );

        const usuarioR = await UsuarioModel.findByPk(usuario[0]);

        resp.json(usuarioR);

    }
    catch(error){
        console.log(error);
    }
}
const putUsuario = async (req, resp = response) => {
        const { cve } = req.params;
        const { body } = req;
    
        try {
            const updatedRows = await UsuarioModel.sequelize.query(
                'UPDATE usuario SET Nombre = :nombre, Apellido_p = :apellido_p, Apellido_m = :apellido_m, Telefono = :telefono, Correo = :correo WHERE Id_usuarios = :cve',
                {
                    replacements: {
                        cve: cve,
                        nombre: body.Nombre,
                        apellido_p: body.Apellido_p,
                        apellido_m: body.Apellido_m,
                        telefono: body.Telefono,
                        correo: body.Correo,
                    },
                    type: UsuarioModel.sequelize.QueryTypes.UPDATE,
                }
            );
    
            if (updatedRows[1] === 0) {
                return resp.status(404).json({
                    mensaje: "No se encuentra el registro"
                });
            }
    
            // Obtén el registro actualizado (opcional)
            const updatedUsuario = await UsuarioModel.findByPk(cve);
    
            resp.json(updatedUsuario);
        } catch (error) {
            console.log(error);
            resp.status(500).json({
                mensaje: "Error interno del servidor"
            });
        }    
}

const deleteUsuario = async (req, resp = response) => {
    
    const {cve} = req.params;
    try{
        const usuario = await UsuarioModel.findByPk(cve);
        if (!usuario){
            return resp.status(404).json({
                mensaje: "Registro no encontrado"
            });
        }
        //eliminación física
        //await materia.destroy();
        //eliminación lógica
        await usuario.update({estadoUsuario:false});
        resp.json(usuario);
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    getUsuarios,
    getUsuario,
    postUsuario,
    putUsuario,
    deleteUsuario
}