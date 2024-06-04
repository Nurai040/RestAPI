"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMiddlewares = void 0;
const express_request_id_1 = __importDefault(require("express-request-id"));
const logger_1 = require("../libs/logger");
const loadMiddlewares = (app, context) => {
    app.use((0, express_request_id_1.default)());
    app.use((req, res, next) => {
        req.log = logger_1.logger.child({ correlationId: req.id });
        next();
    });
};
exports.loadMiddlewares = loadMiddlewares;
//# sourceMappingURL=middlewares.js.map