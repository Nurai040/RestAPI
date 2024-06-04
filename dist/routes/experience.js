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
const role_1 = require("../middleware/role");
const user_model_1 = require("../models/user.model");
const experience_service_1 = require("../services/experience.service");
const makeExperienceRouter = (context) => {
    const router = express_1.default.Router();
    const experienceService = new experience_service_1.ExperienceService();
    router.post('/experience', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield experienceService.addExperience(req, res);
    }));
    router.get('/experience', passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield experienceService.getExperience(req, res);
    }));
    router.get('/experience/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield experienceService.getExperienceById(req, res);
    }));
    router.put('/experience/:id', passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin, user_model_1.UserRole.User]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield experienceService.updateExpById(req, res);
    }));
    router.delete('/experience/:id', passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin, user_model_1.UserRole.User]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield experienceService.deleteExpById(req, res);
    }));
    return router;
};
exports.makeExperienceRouter = makeExperienceRouter;
//# sourceMappingURL=experience.js.map