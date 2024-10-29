/*se recomienda crear un archivo por cada acceso a 
el modelo: materia.js -> tablaMateria
profesor.js -> tablaProfesor
*/

const {Router} = require('express');
const {agendarCita,getCitas,
getCita,
postCita,
putCita,
deleteCita} = require('../controller/citacontroller');
const router = Router();
/*
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
$ npm install --save oracledb # Oracle Database

*/


//aquí se van a colocar todas las rutas del proyecto

router.get('/', getCitas);
router.get('/:cve', getCita);
router.post('/',    postCita);
router.put('/:cve', putCita);
router.delete('/:cve', deleteCita);
router.post('/agendar-cita', agendarCita);

module.exports = router;