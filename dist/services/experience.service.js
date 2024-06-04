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
exports.ExperienceService = void 0;
const experience_model_1 = require("../models/experience.model");
const user_model_1 = require("../models/user.model");
class ExperienceService {
    addExperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, company_name, role, startDate, endDate, description } = req.body;
                const experience = yield experience_model_1.Experience.create({
                    user_id,
                    company_name,
                    role,
                    startDate,
                    endDate,
                    description,
                });
                return res.status(201).json(experience);
            }
            catch (error) {
                console.error('Error with post /api/experience: ', error);
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    getExperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageSize = parseInt(req.query.pageSize) || 10;
                const page = parseInt(req.query.page) || 1;
                const { count, rows } = yield experience_model_1.Experience.findAndCountAll({
                    limit: pageSize,
                    offset: (page - 1) * pageSize,
                });
                res.setHeader('X-total-count', count);
                return res.status(200).json(rows.map((user) => ({
                    id: user.id,
                    userId: user.user_id,
                    companyName: user.company_name,
                    role: user.role,
                    startDate: user.startDate,
                    endDate: user.endDate,
                    description: user.description,
                })));
            }
            catch (error) {
                console.error('Error with get /api/experience: ', error);
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    getExperienceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expId = parseInt(req.params.id);
                const currentExp = yield experience_model_1.Experience.findByPk(expId);
                if (!currentExp) {
                    return res.status(404).json({ message: 'Not found' });
                }
                return res.status(200).json(currentExp);
            }
            catch (error) {
                console.error('Error with get /api/experience/:id: ', error);
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    updateExpById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, companyName, role, startDate, endDate, description } = req.body;
                const expId = parseInt(req.params.id);
                const currentExp = yield experience_model_1.Experience.findByPk(expId);
                if (!currentExp) {
                    return res.status(404).json({ message: 'Not found' });
                }
                if (req.user.id !== currentExp.user_id &&
                    req.user.role !== user_model_1.UserRole.Admin) {
                    return res
                        .status(403)
                        .json({ message: 'Unauthorized to update this experience' });
                }
                if (userId)
                    currentExp.user_id = userId;
                if (companyName)
                    currentExp.company_name = companyName;
                if (role)
                    currentExp.role = role;
                if (startDate)
                    currentExp.startDate = startDate;
                if (endDate)
                    currentExp.endDate = endDate;
                if (description)
                    currentExp.description = description;
                yield currentExp.save();
                return res.status(200).json(currentExp);
            }
            catch (error) {
                console.error('Error with put /api/experience/:id: ', error);
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    deleteExpById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expId = parseInt(req.params.id);
                const currentExp = yield experience_model_1.Experience.findByPk(expId);
                if (!currentExp) {
                    return res.status(404).json({ message: 'Not found' });
                }
                if (req.user.id !== currentExp.user_id &&
                    req.user.role !== user_model_1.UserRole.Admin) {
                    return res
                        .status(403)
                        .json({ message: 'Unauthorized to delete this experience' });
                }
                yield currentExp.destroy();
                return res.status(200).json({ message: 'The experience is deleted' });
            }
            catch (error) {
                console.error('Error with delete /api/experience/:id: ', error);
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
}
exports.ExperienceService = ExperienceService;
//# sourceMappingURL=experience.service.js.map