const {Router} = require('express');
const {getPsicologoVista,getPsicologos,
getPsicologo,
postPsicologo,
putPsicologo,
deletePsicologo,
registrarPsicologo} = require('../controller/psicologocontroller');
const router = Router();

//aquí se van a colocar todas las rutas del proyecto
router.get('/lista', getPsicologoVista);
router.get('/', getPsicologos);
router.get('/:cve', getPsicologo);
router.post('/',    postPsicologo);
router.put('/:cve', putPsicologo);
router.delete('/:cve', deletePsicologo);
router.post('/registrar_psicologo', registrarPsicologo)


module.exports = router;