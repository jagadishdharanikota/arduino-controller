import morgan from 'morgan';
import logger from './logger.js';

const format = 'dev';
const options = {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
};

export default morgan(format, options);
