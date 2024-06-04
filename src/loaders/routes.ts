import express from 'express';
import { Context } from '../interfaces/general';
import { makeAuthRouter } from '../routes/auth';
import path from 'path';
import { makeUserRouter } from '../routes/users';
import { makeExperienceRouter } from '../routes/experience';
import { makeFeedbackRouter } from '../routes/feedback';
import { makeProjectsRouter } from '../routes/projects';
import { makeCVRouter } from '../routes/cv';

export const loadRoutes = (app: express.Router, context: Context) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/public', express.static(path.join(__dirname, '../../public')));

  app.use('/api/auth', makeAuthRouter(context));
  app.use('/api', makeUserRouter(context));
  app.use('/api', makeExperienceRouter(context));
  app.use('/api', makeFeedbackRouter(context));
  app.use('/api', makeProjectsRouter(context));
  app.use('/api', makeCVRouter(context));
};
