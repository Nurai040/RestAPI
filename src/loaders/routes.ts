import express from 'express';
import {Context} from '../interfaces/general';
import {makeAuthRouter} from '../routes/auth';
import path from 'path';
import { makeUserRouter } from '../routes/users';

export const loadRoutes = (app: express.Router, context: Context) => {
  app.use('/public', express.static(path.join(__dirname, '../../public')));

  app.use('/api/auth', makeAuthRouter(context));
  app.use('/api', makeUserRouter(context));
}
