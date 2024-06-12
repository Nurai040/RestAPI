import passport from 'passport';
import { Context, RouterFactory } from '../interfaces/general';
import express from 'express';
import { check, param, query } from 'express-validator';
import { roles } from '../middleware/role';
import { UserRole } from '../models/user.model';
import { validationResult } from 'express-validator';
import { ProjectService } from '../services/project.service';
import upload from '../middleware/upload';

export const makeProjectsRouter = (context: Context) => {
  const router = express.Router();
  const projectService = new ProjectService();

  router.post(
    '/projects',[
      check('user_id').isInt(),
      check('description').isString()
    ],
    passport.authenticate('jwt', { session: false }),
    upload.single('projectImage'),
    async (req:any, res:any) => {
      const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Validation error', errors });
        }
      await projectService.createProject(req, res);
    },
  );

  router.get(
    '/projects',[
      query('pageSize').optional().isInt({min: 1, max:100}).toInt(),
      query('page').optional().isInt({min:1}).toInt(),
    ],
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin]),
    async (req:any, res:any) => {
      const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Validation error', errors });
        }
      await projectService.getProject(req, res);
    },
  );

  router.get('/projects/:id', [
    param('id').isInt().withMessage('ID must be an integer')
    ], async (req:any, res:any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Validation error', errors });
        }
    await projectService.getProjectById(req, res);
  });

  router.put(
    '/projects/:id',[
      param('id').isInt().withMessage('ID must be an integer'),
      check('user_id').isInt(),
      check('description').isString()
    ],
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin, UserRole.User]),
    upload.single('projectImage'),
    async (req:any, res:any) => {
      const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Validation error', errors });
        }
      await projectService.updateProjectById(req, res);
    },
  );

  router.delete(
    '/projects/:id', [
      param('id').isInt().withMessage('ID must be an integer') 
    ],
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin, UserRole.User]),
    async (req:any, res:any) => {
      const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Validation error', errors });
        }
      await projectService.deleteProjectById(req, res);
    },
  );

  return router;
};
