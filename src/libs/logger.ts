const pino = require('pino');


export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  prettyPrint: process.env.NODE_ENV === 'development',
});
