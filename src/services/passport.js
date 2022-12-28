import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import dbManager from '../shared/db-manager.js';

export default function (req, res, next) {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    'local',
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await dbManager.find('users', { username });

        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        if (user[0] && user[0]?.password !== password) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, { username: user[0].username });
      } catch (error) {
        return done(null, false, { message: 'Failed to login' });
      }
    })
  );

  next();
}
