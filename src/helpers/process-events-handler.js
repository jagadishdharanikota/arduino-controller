import logger from '../shared/logger.js';

function processEventsHandler() {
  // Handling process termination
  // https://expressjs.com/en/advanced/best-practice-performance.html
  process.on('uncaughtException', async (error) => {
    logger.error(`Uncaught exception occured: ${error}`);
    process.emit(0);
  });

  // Ctrl + C
  process.on('SIGINT', async (error) => {
    logger.error('Process interrupted', error);
    process.emit(0);
    // CTRL + C is not terminating the process from VSCode terminal so shutting down the process
    process.exit(1);
  });

  // Killing the process
  process.on('SIGTERM', async (error) => {
    logger.error('Process is killed', error);
    process.emit(0);
  });
}

export default processEventsHandler;
