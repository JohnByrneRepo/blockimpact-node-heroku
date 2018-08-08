'use strict';

const session = require('express-session');
const express = require('express');
const http = require('http');
const uuid = require('uuid');
const WebSocket = require('ws');
const path = require('path');
const pg = require('pg');
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

var connectionString = `postgres://faidqtllatsqwe:1a3f272127e1f071490f6f3c284f0653f55406113316aafa8d86dc1c286d8930@ec2-54-225-76-201.compute-1.amazonaws.com:5432/d9r70ap1bmoqk0`;

const app = express();

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
  saveUninitialized: false,
  secret: '$eCuRiTy',
  resave: false
});

//
// Serve static files from the 'public' folder.
//

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

app.get('/', function(request, response){
    response.sendfile(INDEX);
});

//
// Create HTTP server by ourselves.
//
const server = http.createServer(app)



const wss = new WebSocket.Server({
  verifyClient: (info, done) => {
    console.log('Parsing session from request...');
    sessionParser(info.req, {}, () => {
      console.log('Session is parsed!');

      //
      // We can reject the connection by returning false to done(). For example,
      // reject here if user is unknown.
      //
      done(info.req.session.userId);
    });
  },
  server
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

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));

  ws.on('message', function incoming(data) {
    console.log(data);
    broadcast(data);
  });
});

//
// Start the server.
//

server
  .listen(PORT, () => console.log('Listening on http://localhost:8080'));