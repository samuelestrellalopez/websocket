const express = require('express');
const router = express.Router();
const { markFleteAsAccepted, markFleteAsCompleted } = require('../utils/fleteStatus');

// Aceptar flete
router.post('/:fleteId/accept', (req, res) => {
  const { driverId, userId } = req.body; // Recibir el userId también
  const fleteId = req.params.fleteId;

  markFleteAsAccepted(fleteId, driverId, userId);  // Marcar el flete como aceptado
  res.status(200).send({ message: 'Flete aceptado', fleteId, driverId, userId });
});

// Finalizar flete
router.post('/:fleteId/complete', (req, res) => {
  const fleteId = req.params.fleteId;
  
  markFleteAsCompleted(fleteId);  // Finalizar el flete
  res.status(200).send({ message: 'Flete finalizado', fleteId });
});

module.exports = router;
