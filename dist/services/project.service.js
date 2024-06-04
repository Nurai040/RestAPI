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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const project_model_1 = require("../models/project.model");
const user_model_1 = require("../models/user.model");
class ProjectService {
    createProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, description } = req.body;
                let image = null;
                if (req.file) {
                    image = req.file.filename;
                }
                const project = yield project_model_1.Project.create({
                    user_id: userId,
                    image,
                    description,
                });
                return res.status(200).json(project);
            }
            catch (error) {
                console.error('Error with creating project: ', error);
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    getProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageSize = parseInt(req.query.pageSize) || 10;
                const page = parseInt(req.query.page) || 1;
                const { count, rows } = yield project_model_1.Project.findAndCountAll({
                    limit: pageSize,
                    offset: (page - 1) * pageSize,
                });
                res.setHeader('X-total-count', count);
                return res.status(200).json(rows);
            }
            catch (error) {
                console.error('Error with fetching projects: ', error);
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    getProjectById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectId = parseInt(req.params.id);
                const currentPrjct = yield project_model_1.Project.findByPk(projectId);
                if (!currentPrjct) {
                    return res.status(404).json({ messsage: 'Not found' });
                }
                return res.statis(200).json(currentPrjct);
            }
            catch (error) {
                console.error('Error with fetching project by ID: ', error);
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    updateProjectById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectId = parseInt(req.params.id);
                const currentPrjct = yield project_model_1.Project.findByPk(projectId);
                const { userId, description } = req.body;
                let image = null;
                if (req.file) {
                    image = req.file.filename;
                }
                if (!currentPrjct) {
                    return res.status(404).json({ messsage: 'Not found' });
                }
                if (currentPrjct.user_id !== req.user.id &&
                    req.user.role !== user_model_1.UserRole.Admin) {
                    return res
                        .status(403)
                        .json({ message: 'Unauthorized to update this project' });
                }
                if (userId)
                    currentPrjct.user_id = userId;
                if (image)
                    currentPrjct.image = image;
                if (description)
                    currentPrjct.description = description;
                yield currentPrjct.save();
                return res.status(200).json(currentPrjct);
            }
            catch (error) {
                console.error('Error with updating project by ID: ', error);
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    deleteProjectById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectId = parseInt(req.params.id);
                const currentPrjct = yield project_model_1.Project.findByPk(projectId);
                if (!currentPrjct) {
                    return res.status(404).json({ messsage: 'Not found' });
                }
                if (currentPrjct.user_id !== req.user.id &&
                    req.user.role !== user_model_1.UserRole.Admin) {
                    return res
                        .status(403)
                        .json({ message: 'Unauthorized to delete this project' });
                }
                yield currentPrjct.destroy();
                return res.status(200).json({ message: 'Project is deleted!' });
            }
            catch (error) {
                console.error('Error with deleting project by ID: ', error);
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
}
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map