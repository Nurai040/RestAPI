import passport from 'passport';
import { Context, RouterFactory } from '../interfaces/general';
import express from 'express';
import { check, param, query } from 'express-validator';
import { roles } from '../middleware/role';
import { UserRole } from '../models/user.model';
import { validationResult } from 'express-validator';
import { FeedbackService } from '../services/feedback.service';

export const makeFeedbackRouter = (context: Context) => {
  const router = express.Router();
  const feedbackService = new FeedbackService();

  router.post(
    '/feedback',
    [
      check('context').isString(),
      check('companyName').isString().isLength({ max: 128 }),
    ],
    passport.authenticate('jwt', { session: false }),
    async (req: any, res: any) => {
      const log = req.log;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log.error('post /feedback ', errors);
        return res.status(400).json({ message: 'Validation error', errors });
      }
      await feedbackService.createFeedback(req, res);
    },
  );

  router.get(
    '/feedback',
    [
      query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
      query('page').optional().isInt({ min: 1 }).toInt(),
    ],
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin]),
    async (req: any, res: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors });
      }
      await feedbackService.getFeedback(req, res);
    },
  );

  router.get(
    '/feedback/:id',
    [param('id').isInt().withMessage('ID must be an integer')],
    async (req: any, res: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors });
      }
      await feedbackService.getFeedbackById(req, res);
    },
  );

  router.put(
    '/feedback/:id',
    [
      param('id').isInt().withMessage('ID must be an integer'),
      check('context').isString(),
      check('company_Name').isString().isLength({ max: 128 }),
    ],
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin, UserRole.User]),
    async (req: any, res: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors });
      }
      await feedbackService.updateFeedbackById(req, res);
    },
  );

  router.delete(
    '/feedback/:id',
    [param('id').isInt().withMessage('ID must be an integer')],
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin, UserRole.User]),
    async (req: any, res: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors });
      }
      await feedbackService.deleteFeedbackById(req, res);
    },
  );

  return router;
};
