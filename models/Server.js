const express = require('express');
const cors = require('cors');
const dbConnection = require('../database/conecta');


//fg
const path = require('path');


class Server{
    constructor(){
        this.app = express();
        this.port = 8001;
        this.dbConnection();
        this.middleware();

        //this.routes();
        this.app.use('/cita', require('../routes/citas'));
        this.app.use('/psicologo', require('../routes/psicologos'));
        this.app.use('/usuario', require('../routes/usuarios'));
        this.app.use('/paciente', require('../routes/pacientes'));

               
    }

    async dbConnection(){
        try{
            await dbConnection.authenticate();
            console.log("Base de datos conectada");
        }
        catch(error){
            console.log(error);
        }
    }
    
    middleware(){
        //para enviar datos al servidor
        this.app.use(cors());
        this.app.use(express.json());
        ///
        this.app.use(express.static('public'));
        //this.app.use(express.static('css'));
        /*
        this.app.use(express.static(path.join(__dirname, '../views')));

        this.app.get('/views/agendar_cita.html', (req, res) => {
            res.sendFile(path.join(__dirname, '../views/agendar_cita.html'));
        });
*/
    }

    
    listen(){
        this.app.listen(this.port, () => {
            console.log('Escuchando en puerto', this.port);
        });
    }
}

//para que otro archivo vea esta class
module.exports = Server;