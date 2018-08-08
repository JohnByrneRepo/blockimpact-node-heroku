'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const bodyParser = require('body-parser');
const pg = require('pg');

var connectionString = `postgres://faidqtllatsqwe:1a3f272127e1f071490f6f3c284f0653f55406113316aafa8d86dc1c286d8930@ec2-54-225-76-201.compute-1.amazonaws.com:5432/d9r70ap1bmoqk0`;

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');


// const { Client } = require('pg');

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true,
// });

// client.connect();

const app = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


const ws = new SocketServer({ app });

app.post('/create-user', function(req, res) {
  var firstname = req.body.firstname,
    lastname = req.body.lastname,
    id = req.body.id,
    email = req.body.email;

    pg.connect(connectionString,function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('INSERT INTO users (firstname, lastname, id, email) values($1, $2, $3, $4)',
        [firstname, lastname, id, email], function(err, result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send({ message: 'success' });
       });
    });
});

function broadcast(data) {
  var data = JSON.parse(data).data;
  ws.clients.forEach((client) => {
    client.send(JSON.stringify({
      data: {
        type: 'chatMessage',
        value: data.value,
        source: data.source
      }
    }));
  });
}

ws.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));

  ws.on('message', function incoming(data) {
    console.log(data);
    broadcast(data);
  });
});


// setInterval(() => {
//   ws.clients.forEach((client) => {
//     client.send(JSON.stringify({
//       data: {
//         type: 'timer',
//         value: new Date().toTimeString()
//       }
//     }));
//   });
// }, 1000);