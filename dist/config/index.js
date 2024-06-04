"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const configs = {
    development: {
        db: {
            host: 'localhost',
            port: 3306,
            username: 'dev',
            password: 'dev',
            database: 'capstone_project',
        },
        redis: {
            host: 'localhost',
            port: 6379,
        },
        auth: {
            secret: 'some-dev-secret',
        },
    },
};
const getConfig = () => {
    if (!process.env.NODE_ENV) {
        throw new Error('Env parameter NODE_ENV must be specified! Possible values are "development", ...');
    }
    const env = process.env.NODE_ENV;
    if (!configs[env]) {
        throw new Error('Unsupported NODE_ENV value was provided! Possible values are "development", ...');
    }
    return configs[env];
};
exports.config = getConfig();
//# sourceMappingURL=index.js.map