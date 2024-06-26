import passport from 'passport';
import { Context, RouterFactory } from '../interfaces/general';
import express from 'express';
import { check, param, query } from 'express-validator';
import { roles } from '../middleware/role';
import { User, UserRole } from '../models/user.model';
import { validationResult } from 'express-validator';
import { UserService } from '../services/user.service';
import upload from '../middleware/upload';
import { cachService } from '../services/redis.service';

export const makeUserRouter = (context: Context) => {
  const router = express.Router();
  const userservice = new UserService();

  router.post(
    '/users',
    [
      check('email', "email shouldn't be empty")
        .notEmpty()
        .isString()
        .isLength({ max: 255 }),
      check('email', 'not correct email').isEmail(),
      check('password', 'Password should be length of >4 and <255').isLength({
        min: 4,
        max: 255,
      }),
      check('firstName', 'The field with firstName should not be empty')
        .notEmpty()
        .isString()
        .isLength({ max: 128 }),
      check('lastName', 'The field with lastName should not be empty')
        .notEmpty()
        .isString()
        .isLength({ max: 128 }),
      check('role').isString().isLength({ max: 50 }),
      check('title').isString().isLength({ max: 256 }),
      check('summary').isString().isLength({ max: 256 }),
    ],
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin]),
    async (req: any, res: any) => {
      const log = req.log;
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Validation error', errors });
        }
        const user = await userservice.addUser(req, res);

        return res.status(201).json(user);
      } catch (err) {
        log.error('Error on the path POST /api/users: ', { err });
        return res
          .status(505)
          .json({ message: 'Something went wrong on the server' });
      }
    },
  );

  router.get(
    '/users',
    [
      query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
      query('page').optional().isInt({ min: 1 }).toInt(),
    ],
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin]),
    async (req: any, res: any) => {
      const log = req.log;
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Validation error', errors });
        }
        await userservice.getUsers(req, res);
      } catch (err) {
        log.error('Error with get /users', { err });
      }
    },
  );

  router.get(
    '/users/:id',
    [param('id').isInt().withMessage('ID must be an integer')],
    passport.authenticate('jwt', { session: false }),
    async (req: any, res: any) => {
      const log = req.log;
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Validation error', errors });
        }
        const id = parseInt(req.params.id);
        const cacheKey = `users_${id}`;
        const cacheData = await cachService.get(cacheKey);

        if (cacheData) {
          log.info('User is fetched successfully');
          return res.status(200).json(cacheData);
        }

        const user = await User.findByPk(id);

        if (!user) {
          log.warn(`User with ${id} is not found`);
          return res.status(404).json('Not found with this id');
        }

        await cachService.set(cacheKey, user, 7200);
        log.info('User is fetched successfully');
        return res.status(200).json(user);
      } catch (error) {
        log.error('Error with fetching user with id: ', { error });
        return res
          .status(505)
          .json({ message: 'Something went wrong on the server' });
      }
    },
  );

  router.put(
    '/users/:id',
    [
      param('id').isInt().withMessage('ID must be an integer'),
      check('email', "email shouldn't be empty")
        .notEmpty()
        .isString()
        .isLength({ max: 255 }),
      check('email', 'not correct email').isEmail(),
      check('password', 'Password should be length of >4 and <255').isLength({
        min: 4,
        max: 255,
      }),
      check('firstName', 'The field with firstName should not be empty')
        .notEmpty()
        .isString()
        .isLength({ max: 128 }),
      check('lastName', 'The field with lastName should not be empty')
        .notEmpty()
        .isString()
        .isLength({ max: 128 }),
      check('role').isString().isLength({ max: 50 }),
      check('title').isString().isLength({ max: 256 }),
      check('summary').isString().isLength({ max: 256 }),
    ],
    passport.authenticate('jwt', { session: false }),
    upload.single('profileImage'),
    async (req: any, res: any) => {
      const log = req.log;
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Validation error', errors });
        }
        await userservice.putUser(req, res);
      } catch (err) {
        log.error(`Error with put /users/${req.params.id}`);
      }
    },
  );

  router.delete(
    '/users/:id',
    [param('id').isInt().withMessage('ID must be an integer')],
    passport.authenticate('jwt', { session: false }),
    async (req: any, res: any) => {
      const log = req.log;
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Validation error', errors });
        }
        const userID = parseInt(req.params.id);

        const user = await User.findByPk(userID);

        const currentUser = req.user as { id: number; role: string };

        if (!user) {
          log.warn(`User with ${userID} id is not found`);
          return res
            .status(404)
            .json({ message: 'User with this id is not found' });
        }

        if (currentUser.id !== user.id && currentUser.role !== UserRole.Admin) {
          log.warn(`Unauthorized to delete user with ${userID}`);
          return res
            .status(403)
            .json({ message: 'Unauthorized to delete this user' });
        }

        await user.destroy();
        await cachService.delByPattern('users_*');
        await cachService.delByPattern(`cv_${userID}`);
        log.info('User is deleted');
        return res.status(204).json({ message: 'User is deleted!' });
      } catch (err) {
        log.error('Error with deleting user: ', { err });
        return res
          .status(505)
          .json({ message: 'Something went wrong on the server' });
      }
    },
  );
  return router;
};
