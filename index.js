'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const ws = new SocketServer({ server });

ws.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

ws.on('message', function incoming(data) {
  console.log(data);
  ws.clients.forEach((client) => {
    client.send(JSON.stringify({
      data: {
        type: 'chatMessage',
        value: data
      }
    }));
  });
});

setInterval(() => {
  ws.clients.forEach((client) => {
    client.send(JSON.stringify({
      data: {
        type: 'timer',
        value: new Date().toTimeString()
      }
    }));
  });
}, 1000);