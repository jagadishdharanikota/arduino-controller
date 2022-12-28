import express from 'express';
import crypto from 'crypto';

const router = express.Router();
export default () => {
  const userIdSessionMap = new Map();
  /**
   * URL Format: /session/create?from={from}&to={to}
   */
  router.get('/session/create', async (req, res) => {
    const { from, to } = req.query;
    const fromToId = `${from}-${to}`;
    const toFromId = `${to}-${from}`;
    if (userIdSessionMap.has(fromToId)) {
      res.status(200).json({
        from,
        to,
        sessionId: userIdSessionMap.get(fromToId),
      });
    } else if (userIdSessionMap.has(toFromId)) {
      res.status(200).json({
        from,
        to,
        sessionId: userIdSessionMap.get(toFromId),
      });
    } else {
      const sessionId = crypto.createHash('sha256').update(fromToId).digest('hex');
      userIdSessionMap.set(fromToId, sessionId);

      res.status(200).json({
        from,
        to,
        sessionId,
      });
    }
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
