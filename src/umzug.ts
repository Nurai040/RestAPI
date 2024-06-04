import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';
import { config } from './config';

const sequelize = new Sequelize({
  dialect: 'mysql',
  ...config.db,
});

export const migrator = new Umzug({
  migrations: {
    glob: ['./migrations/*.ts', { cwd: __dirname }],
  },
  context: sequelize,
  storage: new SequelizeStorage({
    sequelize,
  }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;
