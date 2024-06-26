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
exports.makeCVRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_model_1 = require("../models/user.model");
const project_model_1 = require("../models/project.model");
const feedback_model_1 = require("../models/feedback.model");
const experience_model_1 = require("../models/experience.model");
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const redis_service_1 = require("../services/redis.service");
const makeCVRouter = (context) => {
    const router = express_1.default.Router();
    router.get('/user/:userId/cv', [(0, express_validator_1.param)('userId').isInt().withMessage('ID must be an integer')], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const log = req.log;
        try {
            const errors = (0, express_validator_2.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Validation error', errors });
            }
            const userId = parseInt(req.params.userId);
            const cacheKey = `cv_${userId}`;
            const cacheData = yield redis_service_1.cachService.get(cacheKey);
            if (cacheData) {
                log.info(`Returning cached data for CV of user with ${userId} id`);
                return res.status(200).json(cacheData);
            }
            const user = yield user_model_1.User.findByPk(userId, {
                include: [project_model_1.Project, { model: feedback_model_1.Feedback, as: 'ToUser' }, experience_model_1.Experience],
            });
            if (!user) {
                log.warn(`User with ${userId} id is not found (for CV)`);
                return res.status(404).json({ message: 'Not found' });
            }
            yield redis_service_1.cachService.set(cacheKey, user, 7200);
            log.info(`Fetching CV for user with ${userId} id`);
            return res.status(200).json(user);
        }
        catch (error) {
            log.error('Error with fetching the CV: ', { error });
            return res
                .status(505)
                .json({ message: 'Something went wrong on the server' });
        }
    }));
    return router;
};
exports.makeCVRouter = makeCVRouter;
//# sourceMappingURL=cv.js.map