// controllers/driverController.js
const express = require('express');
const router = express.Router();

// Exporta el controlador que recibe wss como parámetro
module.exports = (wss) => {
  // Ruta para actualizar la ubicación del conductor
  router.post('/location', (req, res) => {
    const { fleteId, driverId, latitude, longitude } = req.body;

    // Verifica si se reciben los parámetros necesarios
    if (!fleteId || !driverId) {
      return res.status(400).json({ message: 'ID de flete y conductor son necesarios.' });
    }

    const data = JSON.stringify({ fleteId, driverId, latitude, longitude });

    // Enviar los datos de la ubicación a los clientes conectados
    if (wss.clients) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);  // Envía la ubicación a los clientes WebSocket
        }
      });
    }

    res.status(200).json({ message: 'Ubicación actualizada' });
  });

  return router;  // Devuelve el router para que se use en server.js
};
