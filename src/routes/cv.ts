import { Context, RouterFactory } from '../interfaces/general';
import express from 'express';
import { User, UserRole } from '../models/user.model';
import { Project } from '../models/project.model';
import { Feedback } from '../models/feedback.model';
import { Experience } from '../models/experience.model';
import { param } from 'express-validator';
import { validationResult } from 'express-validator';
import { cachService } from '../services/redis.service';

export const makeCVRouter = (context: Context) => {
  const router = express.Router();

  router.get(
    '/user/:userId/cv',
    [param('userId').isInt().withMessage('ID must be an integer')],
    async (req: any, res: any) => {
      const log = req.log;
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Validation error', errors });
        }
        const userId = parseInt(req.params.userId);
        const cacheKey = `cv_${userId}`;
        const cacheData = await cachService.get(cacheKey);
        if (cacheData) {
          log.info(`Returning cached data for CV of user with ${userId} id`);
          return res.status(200).json(cacheData);
        }
        const user = await User.findByPk(userId, {
          include: [Project, { model: Feedback, as: 'ToUser' }, Experience],
        });

        if (!user) {
          log.warn(`User with ${userId} id is not found (for CV)`);
          return res.status(404).json({ message: 'Not found' });
        }

        await cachService.set(cacheKey, user, 7200);

        log.info(`Fetching CV for user with ${userId} id`);
        return res.status(200).json(user);
      } catch (error) {
        log.error('Error with fetching the CV: ', { error });
        return res
          .status(505)
          .json({ message: 'Something went wrong on the server' });
      }
    },
  );
  return router;
};
