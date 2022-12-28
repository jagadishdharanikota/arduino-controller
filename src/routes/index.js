import express from 'express';
import userRoutes from './user.js';
import sampleRoutes from './sample-routes.js';
import authRoutes from './auth.js';
import wifiArduinoRoutes from './wifi-arduino.js';

const router = express.Router();

export default () => {
  //router.use('/', Object.assign(sampleRoutes(), authRoutes()));
  router.use('/', authRoutes());
  router.use('/user', userRoutes());
  router.use('/wifiarduino', wifiArduinoRoutes());
  return router;
};
