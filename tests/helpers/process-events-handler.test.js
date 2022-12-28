const logger = require('../../src/shared/logger');

describe('Unit testing the server', () => {
  test('catches uncaughtException rejections', () => {
    const error = new Error('mock error');

    jest.spyOn(process, 'on').mockImplementation((event, handler) => {
      if (event === 'uncaughtException') {
        handler(error);
      }
    });
    jest.spyOn(logger, 'error').mockReturnValueOnce();

    const processEventsHandler = require('../../src/helpers/process-events-handler');
    processEventsHandler();
    expect(process.on).toBeCalledWith('uncaughtException', expect.any(Function));
    expect(logger.error).toHaveBeenCalledWith(`Uncaught exception occured: ${error}`);
  });
});
