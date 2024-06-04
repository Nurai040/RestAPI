import passport from 'passport';
import { Context, RouterFactory } from '../interfaces/general';
import express from 'express';
import { check } from 'express-validator';
import { roles } from '../middleware/role';
import { UserRole } from '../models/user.model';
import { validationResult } from 'express-validator';
import { ProjectService } from '../services/project.service';
import upload from '../middleware/upload';

export const makeProjectsRouter = (context: Context) => {
  const router = express.Router();
  const projectService = new ProjectService();

  router.post(
    '/projects',
    passport.authenticate('jwt', { session: false }),
    upload.single('projectImage'),
    async (req, res) => {
      await projectService.createProject(req, res);
    },
  );

  router.get(
    '/projects',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin]),
    async (req, res) => {
      await projectService.getProject(req, res);
    },
  );

  router.get('/projects/:id', async (req, res) => {
    await projectService.getProjectById(req, res);
  });

  router.put(
    '/projects/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin, UserRole.User]),
    upload.single('projectImage'),
    async (req, res) => {
      await projectService.updateProjectById(req, res);
    },
  );

  router.delete(
    '/projects/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin, UserRole.User]),
    async (req, res) => {
      await projectService.deleteProjectById(req, res);
    },
  );

  return router;
};
