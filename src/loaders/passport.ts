import { Context, Loader } from '../interfaces/general';
import { Strategy as LocalStrategy } from 'passport-local';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import passport from 'passport';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

export const loadPassport: Loader = (app, context) => {
  app.use(passport.initialize());

  const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'SECRET_KEY',
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email: string, password: string, done: any) => {
        try {
          const user = await User.findOne({ where: { email } });

          if (!user) {
            return done(null, false, { message: 'Invalid email' });
          }

          const validPass = bcrypt.compareSync(password, user.password);

          if (!validPass) {
            return done(null, false, { message: 'Invalid password' });
          }

          return done(null, user);
        } catch (err) {
          console.error('Error with authentication: ', err);
          return done(err);
        }
      },
    ),
  );

  passport.use(
    new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
      try {
        const user = await User.findByPk(jwt_payload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }),
  );

  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
