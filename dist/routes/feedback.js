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
exports.makeFeedbackRouter = void 0;
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const role_1 = require("../middleware/role");
const user_model_1 = require("../models/user.model");
const feedback_service_1 = require("../services/feedback.service");
const makeFeedbackRouter = (context) => {
    const router = express_1.default.Router();
    const feedbackService = new feedback_service_1.FeedbackService();
    router.post('/feedback', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield feedbackService.createFeedback(req, res);
    }));
    router.get('/feedback', passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield feedbackService.getFeedback(req, res);
    }));
    router.get('/feedback/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield feedbackService.getFeedbackById(req, res);
    }));
    router.put('/feedback/:id', passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin, user_model_1.UserRole.User]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield feedbackService.updateFeedbackById(req, res);
    }));
    router.delete('/feedback/:id', passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin, user_model_1.UserRole.User]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield feedbackService.deleteFeedbackById(req, res);
    }));
    return router;
};
exports.makeFeedbackRouter = makeFeedbackRouter;
//# sourceMappingURL=feedback.js.map