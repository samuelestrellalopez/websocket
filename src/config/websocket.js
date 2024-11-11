const { activeFletes } = require('../utils/fleteStatus');

let activeSockets = {}; // Almacena los sockets activos por fleteId

function handleWebSocket(wss) {
  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      const { driverId, latitude, longitude, fleteId, userId } = JSON.parse(data);

      if (driverId && fleteId) {
        // Inicializar el flete si no existe
        if (!activeSockets[fleteId]) activeSockets[fleteId] = { allClients: [], userClients: {} };

        // Almacenar al cliente en el grupo de flete
        activeSockets[fleteId].allClients.push(ws);

        // Si el flete ha sido aceptado, solo lo mostramos al usuario asignado
        if (activeFletes[fleteId] && activeFletes[fleteId].status === 'aceptado') {
          // Solo enviamos la posición al usuario asignado
          if (activeFletes[fleteId].userId === userId) {
            activeSockets[fleteId].userClients[userId] = ws;
            const position = { latitude, longitude };
            ws.send(JSON.stringify(position));  // Enviar la ubicación al usuario asignado
          }
        } else {
          // Si el flete no ha sido aceptado, mostrarlo a todos
          const position = { latitude, longitude };
          activeSockets[fleteId].allClients.forEach(client => {
            client.send(JSON.stringify(position));  // Enviar la ubicación a todos los usuarios
          });
        }
      }
    });

    ws.on('close', () => {
      // Eliminar la conexión cuando el WebSocket se cierre
      for (const fleteId in activeSockets) {
        activeSockets[fleteId].allClients = activeSockets[fleteId].allClients.filter(client => client !== ws);
      }
    });
  });
}

module.exports = { handleWebSocket };
