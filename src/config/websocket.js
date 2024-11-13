const { activeFletes } = require('../utils/fleteStatus');
const WebSocket = require('ws');

let activeClients = [];

function handleWebSocket(wss) {
  wss.on('connection', (ws) => {
    console.log("Cliente conectado al WebSocket.");
    
    // Agregar el cliente conectado a la lista
    activeClients.push(ws);

    ws.on('message', (data) => {
      const message = data.toString(); // Convertir Buffer a String
      console.log("Mensaje recibido en string:", message);
    
      // Convertir el mensaje a JSON
      try {
        const parsedData = JSON.parse(message);
        console.log("Mensaje recibido en JSON:", parsedData);
    
        // Retransmitir el mensaje a todos los clientes conectados
        activeClients.forEach(client => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(JSON.stringify(parsedData)); // Enviar el mensaje en formato JSON
          }
        });
      } catch (error) {
        console.error("Error al parsear el mensaje:", error);
      }
    });
    

    ws.on('close', () => {
      console.log("Cliente desconectado del WebSocket.");
      // Remover el cliente desconectado de la lista
      activeClients = activeClients.filter(client => client !== ws);
    });
  });
}

module.exports = { handleWebSocket };
