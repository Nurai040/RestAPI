"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrator = void 0;
const umzug_1 = require("umzug");
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
const sequelize = new sequelize_1.Sequelize(Object.assign({ dialect: 'mysql' }, config_1.config.db));
exports.migrator = new umzug_1.Umzug({
    migrations: {
        glob: ['./migrations/*.ts', { cwd: __dirname }],
    },
    context: sequelize,
    storage: new umzug_1.SequelizeStorage({
        sequelize,
    }),
    logger: console,
});
//# sourceMappingURL=umzug.js.map