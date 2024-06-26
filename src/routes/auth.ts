import { Context, RouterFactory } from '../interfaces/general';
import express, { Response } from 'express';
import { check } from 'express-validator';
import upload from '../middleware/upload';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';
import passport from 'passport';
import { generateToken } from '../services/generatejwt';
import { UserRole } from '../models/user.model';
import { roles } from '../middleware/role';

export const makeAuthRouter: RouterFactory = (context: Context) => {
  const router = express.Router();
  const authService = new AuthService();
  // Define routes
  router.post(
    '/register',
    [
      check('email', "email shouldn't be empty").notEmpty(),
      check('email', 'not correct email').isEmail(),
      check('password', 'Password should be length of >4 and <10').isLength({
        min: 4,
        max: 10,
      }),
      check(
        'firstName',
        'The field with firstName should not be empty',
      ).notEmpty(),
      check(
        'lastName',
        'The field with firstName should not be empty',
      ).notEmpty(),
    ],
    upload.single('profileImage'),
    async (req: any, res: any) => {
      const log = req.log;
      try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
          return res
            .status(400)
            .json({ message: 'Error with validation of email or password!' });
        }

        const {
          firstName,
          lastName,
          image,
          title,
          summary,
          role,
          email,
          password,
        } = req.body;

        const user = await authService.registration(
          firstName,
          lastName,
          title,
          summary,
          email,
          password,
          image,
        );

        log.info(`New user is registered with id ${user.id}`);
        res.status(201).json(user);
      } catch (error) {
        if (error.message === 'Email already exists') {
          log.error(`User with existing email trying to register`);
          return res.status(400).json({ message: 'Email already exists' });
        }

        log.error('Error creating user: ', { error });

        return res
          .status(505)
          .json({ message: 'Something went wrong on the servers' });
      }
    },
  );

  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        next(err);
        return res.status(505).json({ message: 'Internal server error' });
      }
      if (!user) {
        next(err);
        return res.status(400).json({ message: 'Incorrect email or password' });
      }

      const token = generateToken(user);
      const filteredUserInfo = {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          title: user.title,
          summary: user.summary,
          email: user.email,
          image: user.image,
        },
        token: token,
      };

      return res.status(200).json(filteredUserInfo);
    })(req, res, next);
  });

  return router;
};
