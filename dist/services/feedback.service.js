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
exports.FeedbackService = void 0;
const user_model_1 = require("../models/user.model");
const feedback_model_1 = require("../models/feedback.model");
const redis_service_1 = require("./redis.service");
class FeedbackService {
    createFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = req.log;
            try {
                const { fromUser, companyName, toUser, context } = req.body;
                const feedback = yield feedback_model_1.Feedback.create({
                    from_user: fromUser,
                    company_name: companyName,
                    to_user: toUser,
                    content: context,
                });
                yield redis_service_1.cachService.delByPattern('feedback_*');
                yield redis_service_1.cachService.delByPattern(`cv_${toUser}`);
                log.info(`New Feedback with ${feedback.id} id is created`);
                return res.status(201).json(feedback);
            }
            catch (error) {
                log.error({ error }, 'Error creating feedback');
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    getFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = req.log;
            try {
                const pageSize = parseInt(req.query.pageSize) || 10;
                const page = parseInt(req.query.page) || 1;
                const cacheKey = `feedback_${page}_${pageSize}`;
                const cacheData = yield redis_service_1.cachService.get(cacheKey);
                if (cacheData) {
                    log.info(`Cached data is returned in fetching feedbacks`);
                    return res.status(200).json(cacheData);
                }
                const { count, rows } = yield feedback_model_1.Feedback.findAndCountAll({
                    limit: pageSize,
                    offset: (page - 1) * pageSize,
                });
                res.setHeader('X-total-count', count);
                yield redis_service_1.cachService.set(cacheKey, rows, 7200);
                log.info(`Fetching feedbacks`);
                return res.status(200).json(rows);
            }
            catch (error) {
                log.error('Error with fetching feedback: ', { error });
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    getFeedbackById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = req.log;
            try {
                const feedbackId = parseInt(req.params.id);
                const cacheKey = `feedback_${feedbackId}`;
                const cacheData = yield redis_service_1.cachService.get(cacheKey);
                if (cacheData) {
                    log.info(`Returning cached data of feedback with ${feedbackId} id`);
                    return res.status(200).json(cacheData);
                }
                const currentFdbck = yield feedback_model_1.Feedback.findByPk(feedbackId);
                if (!currentFdbck) {
                    return res.status(404).json({ message: 'Not found' });
                }
                yield redis_service_1.cachService.set(cacheKey, currentFdbck, 7200);
                log.info(`Fetching the feedback with ${feedbackId} id`);
                return res.status(200).json(currentFdbck);
            }
            catch (error) {
                log.error('Error with fetching feedback by ID: ', { error });
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    updateFeedbackById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = req.log;
            try {
                const { fromUser, companyName, toUser, context } = req.body;
                const fdbckId = parseInt(req.params.id);
                const currentFdbck = yield feedback_model_1.Feedback.findByPk(fdbckId);
                if (!currentFdbck) {
                    log.warn(`Trying to fetch nonexisting feedback, given id - ${fdbckId}`);
                    return res.status(404).json({ message: 'Not found' });
                }
                if (req.user.id !== currentFdbck.from_user &&
                    req.user.role !== user_model_1.UserRole.Admin) {
                    log.warn(`Unauthorized trying to update feedback with ${fdbckId} id`);
                    return res
                        .status(403)
                        .json({ message: 'Unauthorized to update this feedback' });
                }
                if (fromUser)
                    currentFdbck.from_user = fromUser;
                if (companyName)
                    currentFdbck.company_name = companyName;
                if (toUser)
                    currentFdbck.to_user = toUser;
                if (context)
                    currentFdbck.content = context;
                yield currentFdbck.save();
                yield redis_service_1.cachService.delByPattern('feedback_*');
                yield redis_service_1.cachService.delByPattern(`cv_${toUser}`);
                log.info(`Feedback with ${fdbckId} id is updated`);
                return res.status(200).json(currentFdbck);
            }
            catch (error) {
                log.error('Error with updating feedback: ', { error });
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    deleteFeedbackById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = req.log;
            try {
                const fdbckId = parseInt(req.params.id);
                const currentFdbck = yield feedback_model_1.Feedback.findByPk(fdbckId);
                const toUser = currentFdbck.to_user;
                if (!currentFdbck) {
                    log.warn(`Trying to fetch nonexisting feedback, given id - ${fdbckId}`);
                    return res.status(404).json({ message: 'Not found' });
                }
                if (req.user.id !== currentFdbck.from_user &&
                    req.user.role !== user_model_1.UserRole.Admin) {
                    log.warn(`Unauthorized trying to update feedback with ${fdbckId} id`);
                    return res
                        .status(403)
                        .json({ message: 'Unauthorized to delete this feedback' });
                }
                yield currentFdbck.destroy();
                yield redis_service_1.cachService.delByPattern('feedback_*');
                yield redis_service_1.cachService.delByPattern(`cv_${toUser}`);
                log.info(`Feedback with ${fdbckId} id is deleted`);
                return res.status(200).json({ message: 'Deleted the feedback' });
            }
            catch (error) {
                log.error('Error with deleting feedback: ', { error });
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
}
exports.FeedbackService = FeedbackService;
//# sourceMappingURL=feedback.service.js.map