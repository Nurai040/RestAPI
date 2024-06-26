import { loadMiddlewares } from './middlewares';
import { loadRoutes } from './routes';
import express from 'express';
import { loadContext } from './context';
import { loadModels } from './models';
import { loadSequelize } from './sequelize';
import { config } from '../config';
import { loadPassport } from './passport';
import { cachService } from '../services/redis.service';

export const loadApp = async () => {
  const app = express();
  const sequelize = loadSequelize(config);

  loadModels(sequelize);

  const context = await loadContext();

  await cachService.connect();

  loadPassport(app, context);
  loadMiddlewares(app, context);
  loadRoutes(app, context);

  app.use((err: any, req: any, res: any, next: any) => {
    const log = req.log;
    log.error(err);
    res.status(505).json({ message: 'Something went wrong on the server' });
  });

  return app;
};
