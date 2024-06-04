import passport from 'passport';
import { Context, RouterFactory } from '../interfaces/general';
import express from 'express';
import { check } from 'express-validator';
import { roles } from '../middleware/role';
import { UserRole } from '../models/user.model';
import { validationResult } from 'express-validator';
import { ExperienceService } from '../services/experience.service';

export const makeExperienceRouter = (context: Context) => {
  const router = express.Router();
  const experienceService = new ExperienceService();

  router.post(
    '/experience',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      await experienceService.addExperience(req, res);
    },
  );

  router.get(
    '/experience',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin]),
    async (req, res) => {
      await experienceService.getExperience(req, res);
    },
  );

  router.get('/experience/:id', async (req, res) => {
    await experienceService.getExperienceById(req, res);
  });

  router.put(
    '/experience/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin, UserRole.User]),
    async (req, res) => {
      await experienceService.updateExpById(req, res);
    },
  );

  router.delete(
    '/experience/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin, UserRole.User]),
    async (req, res) => {
      await experienceService.deleteExpById(req, res);
    },
  );
  return router;
};
