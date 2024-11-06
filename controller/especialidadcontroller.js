const { response } = require("express");
const EspecialidadModel = require('../models/especialidad');
const { QueryTypes } = require('sequelize');

// Obtener todas las especialidades
const getEspecialidades = async (req, resp = response) => {
    try {
        const especialidades = await EspecialidadModel.sequelize.query(
            "SELECT * FROM especialidad",
            { type: QueryTypes.SELECT }
        );
        resp.json(especialidades);
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            mensaje: "Error al obtener las especialidades"
        });
    }
}

// Obtener una especialidad por ID
const getEspecialidad = async (req, resp = response) => {
    const cve = req.params.cve;
    try {
        const especialidad = await EspecialidadModel.findByPk(cve);
        if (especialidad == null) {
            resp.status(404).json({
                respuesta: false,
                resultado: "No se encuentra"
            });
        } else {
            resp.json(especialidad);
        }
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            mensaje: "Error al obtener la especialidad"
        });
    }
}

// Crear una nueva especialidad
const postEspecialidad = async (req, resp = response) => {
    const { body } = req;
    const especialidadParam = {
        Id_especialidad: body.Id_especialidad,
        Nombre: body.Nombre,
        Descripcion: body.Descripcion
    };
    try {
        const especialidad = await EspecialidadModel.sequelize.query(
            "INSERT INTO especialidad (Id_especialidad, Nombre, Descripcion) VALUES(:paramId_especialidad, :paramNombre, :paramDescripcion)",
            {
                replacements: {
                    paramId_especialidad: especialidadParam.Id_especialidad,
                    paramNombre: especialidadParam.Nombre,
                    paramDescripcion: especialidadParam.Descripcion
                },
                type: QueryTypes.INSERT,
            }
        );

        // Recuperar la especialidad recién creada
        const especialidadR = await EspecialidadModel.findByPk(especialidad[0]);
        resp.json(especialidadR);

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            mensaje: "Error al crear la especialidad"
        });
    }
};

// Actualizar una especialidad
const putEspecialidad = async (req, resp = response) => {
    const { cve } = req.params;
    const { body } = req;

    try {
        const updatedRows = await EspecialidadModel.sequelize.query(
            "UPDATE especialidad SET Nombre = :nombre, Descripcion = :descripcion WHERE Id_especialidad = :cve",
            {
                replacements: {
                    cve: cve,
                    nombre: body.Nombre,
                    descripcion: body.Descripcion
                },
                type: QueryTypes.UPDATE,
            }
        );

        if (updatedRows[1] === 0) {
            return resp.status(404).json({
                mensaje: "No se encuentra el registro"
            });
        }

        // Obtén el registro actualizado
        const updatedEspecialidad = await EspecialidadModel.findByPk(cve);
        resp.json(updatedEspecialidad);

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            mensaje: "Error al actualizar la especialidad"
        });
    }
};

// Eliminar una especialidad
const deleteEspecialidad = async (req, resp = response) => {
    const { cve } = req.params;
    try {
        const especialidad = await EspecialidadModel.findByPk(cve);
        if (!especialidad) {
            return resp.status(404).json({
                mensaje: "Registro no encontrado"
            });
        }
        // Eliminación física de la especialidad
        await especialidad.destroy();
        resp.json({ mensaje: "Especialidad eliminada exitosamente" });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            mensaje: "Error al eliminar la especialidad"
        });
    }
}

module.exports = {
    getEspecialidades,
    getEspecialidad,
    postEspecialidad,
    putEspecialidad,
    deleteEspecialidad
};
