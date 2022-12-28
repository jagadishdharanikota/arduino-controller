import express from 'express';

const router = express.Router();
export default () => {
  router.get('/sample', async (req, res) => {
    res.status(200).json({
      name: 'sample',
      type: 'service',
    });
  });

  router.get('/error', async (req, res, next) => {
    Promise.resolve()
      .then(() => {
        throw new Error('Some error');
      })
      .catch(next);
  });

  return router;
};
