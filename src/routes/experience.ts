import passport from 'passport';
import { Context, RouterFactory } from '../interfaces/general';
import express from 'express';
import { check, param, query } from 'express-validator';
import { roles } from '../middleware/role';
import { UserRole } from '../models/user.model';
import { validationResult } from 'express-validator';
import { ExperienceService } from '../services/experience.service';

export const makeExperienceRouter = (context: Context) => {
  const router = express.Router();
  const experienceService = new ExperienceService();

  router.post(
    '/experience',
    [
      check('user_id').isInt().withMessage('user_id must be an INT'),
      check('company_name').isString().isLength({ max: 256 }),
      check('role').isString().isLength({ max: 256 }),
      check('startDate')
        .isISO8601()
        .withMessage('startDate must be in a valid ISO 8601 format')
        .isBefore(new Date().toISOString())
        .withMessage('startDate must be before the current date'),
      check('endDate')
        .isISO8601()
        .withMessage('endDate must be in a valid ISO 8601 format')
        .isBefore(new Date().toISOString())
        .withMessage('endDate must be before the current date'),
      check('description').isString(),
    ],
    passport.authenticate('jwt', { session: false }),
    async (req: any, res: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors });
      }
      await experienceService.addExperience(req, res);
    },
  );

  router.get(
    '/experience',
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
      await experienceService.getExperience(req, res);
    },
  );

  router.get(
    '/experience/:id',
    [param('id').isInt().withMessage('ID must be an integer')],
    async (req: any, res: any, next: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors });
      }
      await experienceService.getExperienceById(req, res, next);
    },
  );

  router.put(
    '/experience/:id',
    [
      param('id').isInt().withMessage('ID must be an integer'),
      check('user_id').isInt().withMessage('user_id must be an INT'),
      check('company_name').isString().isLength({ max: 256 }),
      check('role').isString().isLength({ max: 256 }),
      check('startDate')
        .isISO8601()
        .withMessage('startDate must be in a valid ISO 8601 format')
        .isBefore(new Date().toISOString())
        .withMessage('startDate must be before the current date'),
      check('endDate')
        .isISO8601()
        .withMessage('endDate must be in a valid ISO 8601 format')
        .isBefore(new Date().toISOString())
        .withMessage('endDate must be before the current date'),
      check('description').isString(),
    ],
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin, UserRole.User]),
    async (req: any, res: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors });
      }
      await experienceService.updateExpById(req, res);
    },
  );

  router.delete(
    '/experience/:id',
    [param('id').isInt().withMessage('ID must be an integer')],
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin, UserRole.User]),
    async (req: any, res: any) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors });
      }
      await experienceService.deleteExpById(req, res);
    },
  );
  return router;
};
