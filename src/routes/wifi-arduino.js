import express from 'express';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
export default () => {
  router.get('/lightstate', async (req, res) => {
    await fs.readFile('src/fs/light.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ status: 'failure', message: err });
      }
      console.log('Printing file data:', data);
      return res.status(200).json(JSON.parse(data));
    });
  });

  router.get('/lightstate/:status', async (req, res) => {
    const status = req.params.status;
    if (status === 'on' || status === 'off') {
      const data = { light: status };
      await fs.writeFile('src/fs/light.json', JSON.stringify(data), (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({});
        }
        console.log('Writing file data:', data);
        return res.status(200).json({ status: 'success', data });
      });
    } else {
      return res.status(422).json({ status: 'failure', message: 'Invalid input' });
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
