const express = require('express');
const router = express.Router();
const controlador = require('../controlador/controlador');

router.get('/:id', controlador.control_detalle);
router.post('/', controlador.control_crear);
router.put('/:id', controlador.control_actualizar);
router.post('/login', controlador.control_login);

module.exports = router;

router.get('/ultimas', controlador.obtener_ultimas);

// Ruta para crear una nueva temperatura (puede ser usada por sensores o sistemas externos)
router.post('/', controlador.crear_temperatura);
