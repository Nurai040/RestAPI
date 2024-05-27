import {loadMiddlewares} from './middlewares';
import {loadRoutes} from './routes';
import express from 'express';
import {loadContext} from './context';
import {loadModels} from './models';
import {loadSequelize} from './sequelize';
import {config} from '../config';
import {loadPassport} from './passport';

export const loadApp = async () => {
  const app = express();
  const sequelize = loadSequelize(config)

  loadModels(sequelize);

  const context = await loadContext();

  loadPassport(app, context);
  loadMiddlewares(app, context);
  loadRoutes(app, context);

  return app;
}
