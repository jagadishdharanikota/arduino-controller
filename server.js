/** ****************************************************************
 * Server.js
 *
 * Description: Entry point to start express node service
 * Author: Jagadish Dharanikota
 ****************************************************************** */

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { response } from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import helmet from 'helmet';
import http from 'http';
import os from 'os';
import passport from 'passport';
import { Server } from 'socket.io';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { CustomError, handleError } from './helpers/error.js';
import processEventsHandler from './helpers/process-events-handler.js';
import { SESSION_COOKIE_NAME } from './helpers/session-config.js';
import { checkAuthenticated, checkNotAuthenticated } from './middleware/session-validator.js';
import routes from './routes/index.js';
import passportImpl from './services/passport.js';
import logger from './shared/logger.js';
import requestLogger from './shared/request-logger.js';

const PORT = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDirectoryPath = path.join(__dirname, '/public');

// console.log(app.get('env'));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(helmet());

//  apply to all requests
app.use(limiter);

/* To make cookie system work when deployed on reverse proxy like Nginx.
This make express trust cookies that are passed through a reverse proxy. */
app.set('trust proxy', 1);

// Middleware to enable CORS requests
app.use(cors());

app.use(requestLogger);

app.use(express.static(publicDirectoryPath, { index: false }));

// Middleware to read cookies from the request header
app.use(cookieParser());

// Middleware to parse application/x-www-form-urlencoded & application/json data from the request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: SESSION_COOKIE_NAME,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(requestLogger);

// Should be called after passport.initialize & passport.session
app.use(passportImpl);

const clientSocketMap = {};
const MSG_FROM_CLIENT = 'MFC';
const MSG_FROM_SERVER = 'MFS';

// Routes
app.use('/api', routes());

app.get('/', checkNotAuthenticated, (req, res) => {
  logger.info('Serving / path');
  res.set('Cache-Control', 'no-store');
  return res.render('index', {
    public: publicDirectoryPath,
  });
});

app.get('/app/appinno', checkAuthenticated, async (req, res) => {
  res.set('Cache-Control', 'no-store');
  return res.render('app', {
    public: publicDirectoryPath,
  });
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/wsclients', (req, res) => {
  res.send(clientSocketMap);
});

/*
  Ideally we don't create REST services like this to retrieve server info. Just for testing purpose.
*/
app.get('/server-info', (req, res) => {
  res.header({ 'Content-Type': 'text/html' }).send(
    `
<h4>Node server is running in ${process.env.NODE_ENV} mode on port ${PORT}.</h4>
<div>-----------------------------------------------------------------------</div>
<ul>
  <li>OS Platform   : ${os.type()} (${os.platform()})</li>
  <li>OS Version    : ${os.release()}</li>
  <li>CPU'S         : ${os.cpus().length}</li>
  <li>Architecture  : ${os.arch()}</li>
  <li>Total Memory  : ${os.totalmem()}</li>
  <li>Free Memory   : ${os.freemem()}</li>
</ul>
<div>-----------------------------------------------------------------------</div>
`
  );
});

// Middleware for error handling if none of the routes are met for the requested url
app.use((req, res, next) => {
  const error = new CustomError(404, `Route not found for the URL: ${req.url}`);
  return next(error);
});

// Middleware for error handling if any of the route logic throws error or exception
// Imp: This middleware should be last among all the middlewares
app.use((error, req, res, next) => {
  const { statusCode = 500, message = 'Internal server error' } = error;
  handleError({ statusCode, status: message, message }, res);
  next();
});

if (process.env.NODE_ENV !== 'test') {
  /* Wrapping listening on port if condition !test is met (for unit testing).
     See this link for more info - https://blog.campvanilla.com/jest-expressjs-and-the-eaddrinuse-error-bac39356c33a
  */
  server.listen(PORT, () => {
    logger.info(
      `Service is listening on port: ${PORT}. Service is accessible on http://localhost:${PORT}/`
    );

    // Reference: https://pm2.keymetrics.io/docs/usage/signals-clean-restart/
    // Here we send the ready signal to PM2. PM2 should be started with wait_ready: true option.
    // process.send will be available on in child process which is when server started pm2
    if (typeof process.send === 'function') {
      process.send('ready');
    }
  });
}

if (typeof processEventsHandler === 'function') {
  logger.info('Registered process event handlers');
  processEventsHandler();
}

server.on('error', (error) => {
  if (error) {
    logger.error(`Failed to start server on the port: ${PORT}. ${error.code} : ${error.message}`);
    logger.error(error.stack);
  }
});

//############################ WebSocket handling #######################################//

io.on('connection', (socket) => {
  const socketId = socket.id;

  logger.info(`New websocket connection established: ${socketId}`);

  io.to(socketId).emit('ack', { socketId });

  socket.on('REGISTER', (payload) => {
    logger.info(`Registering client ${payload.from} with id ${socketId}`);
    clientSocketMap[payload.from] = socketId;
  });

  socket.on('re-ack', (msg) => {
    clientSocketMap[msg.clientId] = socketId;
  });

  socket.on(MSG_FROM_CLIENT, (payload) => {
    const { from, to } = payload;
    const toSocketId = clientSocketMap[to];
    const fromSocketId = clientSocketMap[from];

    console.log(payload);

    // Sending to destination recepient
    io.to(toSocketId).emit(MSG_FROM_SERVER, payload);

    // Sending to sender again for showing it in UI
    // if (from !== 'WebApp') {
    //   io.to(fromSocketId).emit(MSG_FROM_SERVER, payload);
    // }

    // broadcast message to everyone
    //io.emit(MSG_FROM_SERVER, msg);
  });

  socket.on('disconnect', () => {
    for (const [key, value] of Object.entries(clientSocketMap)) {
      if (value === socketId) {
        delete clientSocketMap[key];
      }
    }
    logger.info(`Websocket disconnected: ${socketId}`);
  });
});

module.exports = app;
