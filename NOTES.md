Notes

Web interface: https://blockimpact.herokuapp.com/

Code base currently hosted at: https://github.com/JohnByrneRepo/blockimpact-node-heroku

Clients connect to the socket server with the uri: wss://blockimpact.herokuapp.com/


Heroku app hosted at:

https://dashboard.heroku.com/apps/blockimpact


Update code:

git commit -a
git push


Update Heroku

git push heroku master


Heroku log

heroku logs --tail



Login:

email: blockimpactserver@gmail.com
password: Block123!


Gmail:

email: blockimpactserver@gmail.com
password: Block123


Node deployment notes:

https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app
https://devcenter.heroku.com/articles/node-websockets



Postgres

heroku pg:info

watch heroku pg:info

https://macpostgresclient.com/

http://www.javascriptpoint.com/nodejs-postgresql-tutorial-example/


Database

'postgresql-triangular-33132'

Host: ec2-54-225-76-201.compute-1.amazonaws.com
Database: d9r70ap1bmoqk0
User: faidqtllatsqwe
Port: 5432
Password: 1a3f272127e1f071490f6f3c284f0653f55406113316aafa8d86dc1c286d8930
URI: postgres://faidqtllatsqwe:1a3f272127e1f071490f6f3c284f0653f55406113316aafa8d86dc1c286d8930@ec2-54-225-76-201.compute-1.amazonaws.com:5432/d9r70ap1bmoqk0

Heroku CLI: heroku pg:psql postgresql-triangular-33132 --app blockimpact



