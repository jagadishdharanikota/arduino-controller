import Winston from 'winston';

/* eslint new-cap: "off" */
const logger = new Winston.createLogger({
  transports: [
    new Winston.transports.Console({
      timestamp: new Date().toISOString(),
      colorize: true,
    }),
  ],
});

export default logger;
