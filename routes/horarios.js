const {Router} = require('express');
const {getHorariosVista,getHorarios,
getHorario,
postHorario,
putHorario,
deleteHorario,getHorarioLista} = require('../controller/horariocontroller');
const router = Router();

//aquí se van a colocar todas las rutas del proyecto

router.get('/lista/:idHorario', getHorariosVista); //router.get('/lista/:idHorario', getHorariosVista); 
router.get('/', getHorarios);
router.get('/:cve', getHorario);
router.post('/',    postHorario);
router.put('/:cve', putHorario);
router.delete('/:cve', deleteHorario);
router.get('/horas/:idPsicologo/:Dia', getHorarioLista);

module.exports = router;