import passport from 'passport';
import { Context, RouterFactory } from '../interfaces/general';
import express from 'express';
import { check } from 'express-validator';
import { roles } from '../middleware/role';
import { UserRole } from '../models/user.model';
import { validationResult } from 'express-validator';
import { FeedbackService } from '../services/feedback.service';

export const makeFeedbackRouter = (context: Context) => {
  const router = express.Router();
  const feedbackService = new FeedbackService();

  router.post(
    '/feedback',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      await feedbackService.createFeedback(req, res);
    },
  );

  router.get(
    '/feedback',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin]),
    async (req, res) => {
      await feedbackService.getFeedback(req, res);
    },
  );

  router.get('/feedback/:id', async (req, res) => {
    await feedbackService.getFeedbackById(req, res);
  });

  router.put(
    '/feedback/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin, UserRole.User]),
    async (req, res) => {
      await feedbackService.updateFeedbackById(req, res);
    },
  );

  router.delete(
    '/feedback/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin, UserRole.User]),
    async (req, res) => {
      await feedbackService.deleteFeedbackById(req, res);
    },
  );

  return router;
};
