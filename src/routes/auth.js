import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/users.js';
const router = express.Router();

export default () => {
  router.post('/auth', (req, res, next) => {
    passport.authenticate(
      'local',
      (err, user, info) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.redirect('/');
        }

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.redirect('/app/appinno');
        });
      }
      /*{
        successRedirect: '/app/appinno',
        failureRedirect: '/login',
        failureFlash: true,
      }*/
    )(req, res, next);
  });

  router.post('/auth/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return res.sendStatus(401).send('Invalid username');
      }

      const hashedPassword = await bcrypt(password);
      if (!bcrypt.compare(hashedPassword, user.passport)) {
        return res.sendStatus(401).send('Invalid password');
      }

      var accessToken = generateAccessToken({ username: user.username });

      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);
      res.sendStatus(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (e) {
      return res.sendStatus(500).send('Internal server error');
    }
  });

  router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy(() => {
      res.clearCookie(process.env.SESSION_COOKIE_NAME, { path: '/', httpOnly: true });
    });
    
    if (req.session) {
      req.session = null;
    }
    res.redirect(302, '/');
  });

  router.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken === null) {
      return res.sendStatus(401);
    }

    if (!refreshTokens.includes(refreshToken)) {
      return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      const accessToken = generateAccessToken({ name: user.name });
      res.json({ accessToken });
    });
  });

  return router;
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}
