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
exports.makeExperienceRouter = void 0;
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const role_1 = require("../middleware/role");
const user_model_1 = require("../models/user.model");
const express_validator_2 = require("express-validator");
const experience_service_1 = require("../services/experience.service");
const makeExperienceRouter = (context) => {
    const router = express_1.default.Router();
    const experienceService = new experience_service_1.ExperienceService();
    router.post('/experience', [
        (0, express_validator_1.check)('user_id').isInt().withMessage('user_id must be an INT'),
        (0, express_validator_1.check)('company_name').isString().isLength({ max: 256 }),
        (0, express_validator_1.check)('role').isString().isLength({ max: 256 }),
        (0, express_validator_1.check)('startDate')
            .isISO8601()
            .withMessage('startDate must be in a valid ISO 8601 format')
            .isBefore(new Date().toISOString())
            .withMessage('startDate must be before the current date'),
        (0, express_validator_1.check)('endDate')
            .isISO8601()
            .withMessage('endDate must be in a valid ISO 8601 format')
            .isBefore(new Date().toISOString())
            .withMessage('endDate must be before the current date'),
        (0, express_validator_1.check)('description').isString(),
    ], passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_2.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation error', errors });
        }
        yield experienceService.addExperience(req, res);
    }));
    router.get('/experience', [
        (0, express_validator_1.query)('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
        (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).toInt(),
    ], passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_2.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation error', errors });
        }
        yield experienceService.getExperience(req, res);
    }));
    router.get('/experience/:id', [(0, express_validator_1.param)('id').isInt().withMessage('ID must be an integer')], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_2.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation error', errors });
        }
        yield experienceService.getExperienceById(req, res, next);
    }));
    router.put('/experience/:id', [
        (0, express_validator_1.param)('id').isInt().withMessage('ID must be an integer'),
        (0, express_validator_1.check)('user_id').isInt().withMessage('user_id must be an INT'),
        (0, express_validator_1.check)('company_name').isString().isLength({ max: 256 }),
        (0, express_validator_1.check)('role').isString().isLength({ max: 256 }),
        (0, express_validator_1.check)('startDate')
            .isISO8601()
            .withMessage('startDate must be in a valid ISO 8601 format')
            .isBefore(new Date().toISOString())
            .withMessage('startDate must be before the current date'),
        (0, express_validator_1.check)('endDate')
            .isISO8601()
            .withMessage('endDate must be in a valid ISO 8601 format')
            .isBefore(new Date().toISOString())
            .withMessage('endDate must be before the current date'),
        (0, express_validator_1.check)('description').isString(),
    ], passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin, user_model_1.UserRole.User]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_2.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation error', errors });
        }
        yield experienceService.updateExpById(req, res);
    }));
    router.delete('/experience/:id', [(0, express_validator_1.param)('id').isInt().withMessage('ID must be an integer')], passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin, user_model_1.UserRole.User]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_2.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation error', errors });
        }
        yield experienceService.deleteExpById(req, res);
    }));
    return router;
};
exports.makeExperienceRouter = makeExperienceRouter;
//# sourceMappingURL=experience.js.map