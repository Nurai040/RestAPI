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
const makeCVRouter = (context) => {
    const router = express_1.default.Router();
    router.get('/user/:userId/cv', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.userId);
            const user = yield user_model_1.User.findByPk(userId, { include: [project_model_1.Project, { model: feedback_model_1.Feedback, as: 'ToUser' }, experience_model_1.Experience] });
            if (!user) {
                return res.status(404).json({ message: 'Not found' });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            console.error('Error with fetching the CV: ', error);
            return res
                .status(505)
                .json({ message: 'Something went wrong on the server' });
        }
    }));
    return router;
};
exports.makeCVRouter = makeCVRouter;
//# sourceMappingURL=cv.js.map