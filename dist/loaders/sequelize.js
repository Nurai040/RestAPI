"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSequelize = void 0;
const sequelize_1 = require("sequelize");
const loadSequelize = (config) => {
    return new sequelize_1.Sequelize(Object.assign({ dialect: 'mysql' }, config.db));
};
exports.loadSequelize = loadSequelize;
//# sourceMappingURL=sequelize.js.map