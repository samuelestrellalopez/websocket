const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { handleWebSocket } = require('./config/websocket.js');
const fleteRouter = require('./controllers/fleteController.js');
const DriverRouter = require('./controllers/driverController.js');


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use('/api/fletes', fleteRouter);
app.use('/api/driver', DriverRouter(wss));  

handleWebSocket(wss);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
