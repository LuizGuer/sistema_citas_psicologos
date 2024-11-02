const {Router} = require('express');
const {getServicioVista,getServicios,
getServicio,
postServicio,
putServicio,
deleteServicio} = require('../controller/serviciocontroller');
const router = Router();

//aquí se van a colocar todas las rutas del proyecto

router.get('/lista/:idPsicologo', getServicioVista);
router.get('/', getServicios);
router.get('/:cve', getServicio);
router.post('/',    postServicio);
router.put('/:cve', putServicio);
router.delete('/:cve', deleteServicio);

module.exports = router;