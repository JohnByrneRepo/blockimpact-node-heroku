const pg = require('pg');
var connectionString = `postgres://faidqtllatsqwe:1a3f272127e1f071490f6f3c284f0653f55406113316aafa8d86dc1c286d8930@ec2-54-225-76-201.compute-1.amazonaws.com:5432/d9r70ap1bmoqk0`;

const SocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var connectedUsers = [];
//init Express
var app = express();
//init Express Router
var router = express.Router();
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//return static page with websocket client
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


app.post('/create-user', function(req, res) {
  console.log('req.body');
  console.log(req.body);
  var firstname = req.body.firstname,
    lastname = req.body.lastname,
    id = req.body.id,
    email = req.body.email;

    pg.connect(connectionString, function(err,client,done) {
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


var server = app.listen(port, function () {
    console.log('node.js static server listening on port: ' + port + ", with websockets listener")
})
const wss = new SocketServer({ server });

function broadcast(data) {
  var data = JSON.parse(data).data;
  wss.clients.forEach((client) => {
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
