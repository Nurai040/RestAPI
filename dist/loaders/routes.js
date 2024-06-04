"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../routes/auth");
const path_1 = __importDefault(require("path"));
const users_1 = require("../routes/users");
const experience_1 = require("../routes/experience");
const feedback_1 = require("../routes/feedback");
const projects_1 = require("../routes/projects");
const cv_1 = require("../routes/cv");
const loadRoutes = (app, context) => {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../../public')));
    app.use('/api/auth', (0, auth_1.makeAuthRouter)(context));
    app.use('/api', (0, users_1.makeUserRouter)(context));
    app.use('/api', (0, experience_1.makeExperienceRouter)(context));
    app.use('/api', (0, feedback_1.makeFeedbackRouter)(context));
    app.use('/api', (0, projects_1.makeProjectsRouter)(context));
    app.use('/api', (0, cv_1.makeCVRouter)(context));
};
exports.loadRoutes = loadRoutes;
//# sourceMappingURL=routes.js.map