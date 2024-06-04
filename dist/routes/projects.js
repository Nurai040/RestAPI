"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeProjectsRouter = void 0;
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const role_1 = require("../middleware/role");
const user_model_1 = require("../models/user.model");
const project_service_1 = require("../services/project.service");
const upload_1 = __importDefault(require("../middleware/upload"));
const makeProjectsRouter = (context) => {
    const router = express_1.default.Router();
    const projectService = new project_service_1.ProjectService();
    router.post('/projects', passport_1.default.authenticate('jwt', { session: false }), upload_1.default.single('projectImage'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield projectService.createProject(req, res);
    }));
    router.get('/projects', passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield projectService.getProject(req, res);
    }));
    router.get('/projects/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield projectService.getProjectById(req, res);
    }));
    router.put('/projects/:id', passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin, user_model_1.UserRole.User]), upload_1.default.single('projectImage'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield projectService.updateProjectById(req, res);
    }));
    router.delete('/projects/:id', passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin, user_model_1.UserRole.User]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield projectService.deleteProjectById(req, res);
    }));
    return router;
};
exports.makeProjectsRouter = makeProjectsRouter;
//# sourceMappingURL=projects.js.map