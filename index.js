'use strict';

const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const postgresql = require('pg');
const connect = require('connect');
const mailer = require('nodemailer');
const ejs = require('ejs');

const {
  graphqlExpress,
  graphiqlExpress,
} = require('apollo-server-express');
const cors = require('cors');
const schema = require('./src/graphql/schema');

//const databaseConnecter = require('./lib/postgresql');
//const getMailer = require('./lib/mail');
//const certifyRouter = require('./route/certify');

const API_VERSION = 1;

const startFunc = (uploadFileDir) => {

  process.on('uncaughtException', function(err) {
    console.log('Top level error. you can not recover.', err);
  });

  const app = express();
  app.set('view engine', 'ejs');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  //app.use(bodyParser({uploadDir: uploadFileDir}));
  app.use(cookieParser());

  app.use((req, res, next) => {

    var now = new Date(),
        nowStr = now.getFullYear()
         + "-" + (now.getMonth() + 1)
         + "-" + now.getDate()
         + " " + now.getHours()
         + ":" + now.getMinutes()
         + ":" + now.getSeconds()
         + "." + now.getMilliseconds();
    req.receivedAt = nowStr;

    var reqStr = 'method:' + req.method
               + ',path:' + req.path
               + ',query:' + JSON.stringify(req.query)
               + ',body:' + JSON.stringify(req.body);

    console.log(req.receivedAt, reqStr.replace(/\r?\n/g,''), 'receive request.');
    next();
  });

  app.use(express.static('public'));

  app.get('/', (req, res) => {
    res.render('index', {test: 'TEST'});
  });

  app.use('/api/v' + API_VERSION, (req, res, next) => {
    res.header('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  // var sessionStore = new session.MemoryStore();
  // var sessionParser = session({
  //   store: sessionStore,
  //   secret: process.env.SESSION_SECRET,
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: {
  //     maxAge: 30 * 60 * 1000,
  //     httpOnly: false,
  //   },
  // });
  const sessionParser = session({
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
    },
  });
  app.use(sessionParser);

  //let dbConnections = databaseConnecter(postgresql);
  //app.use(dbConnections.expressConnect);

  //app.use('/api/v' + API_VERSION, certifyRouter(express.Router(), getMailer(mailer)));

  //app.use('*', cors({ origin: 'http://localhost:3000' }));
  //TODO ここがgraphqlの入り口
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  //app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  app.use((req, res, next) => {
    if (!req.session.userInfo) {
      console.log(req.receivedAt, 'No session. No auth.');
      req.connection.done();
      return res.json({auth: false});
    }
    next();
  });

  app.use(function(req, res) {
    console.log(req.receivedAt, 'Resource does not exist.');
    req.connection.done();
    res.status(404);
    res.json({message: 'Not Found'});
  });

  app.use(function(err, req, res, next) {
    console.error(req.receivedAt, 'Fatal Error.', err);
    req.connection && req.connection.done();
    res.status(500);
    res.json({message: 'Server Error'});
  });

  const port = process.env.PORT || 3000;
  var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server start. http://%s:%s', host, port);
  });

};

startFunc('');

