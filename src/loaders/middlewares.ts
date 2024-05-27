import requestId from 'express-request-id';
import { logger } from '../libs/logger';
import {Loader} from '../interfaces/general';

export const loadMiddlewares: Loader = (app, context) => {
    app.use(requestId());

    app.use((req:any, res: any, next: any) => {
        req.log = logger.child({ correlationId: req.id });
        next();
      });
}
