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
const supertest_1 = __importDefault(require("supertest"));
const config_1 = require("../config");
const sequelize_1 = require("../loaders/sequelize");
const generatejwt_1 = require("../services/generatejwt");
const user_model_1 = require("../models/user.model");
const app_1 = require("../loaders/app");
let sequelize;
let server;
let adminToken;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    sequelize = (0, sequelize_1.loadSequelize)(config_1.config);
    yield sequelize.sync({ force: true });
    const adminUser = {
        id: 1,
        email: 'admin@example.com',
        role: user_model_1.UserRole.Admin,
    };
    adminToken = (0, generatejwt_1.generateToken)(adminUser);
    const app = yield (0, app_1.loadApp)();
    server = app.listen(3002, () => {
        console.log(`Test server is running on http://localhost:3002`);
    });
    return server;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.close();
    yield server.close();
}));
describe('FEEDBACK endpoint', () => {
    it('should create a new feedback', () => __awaiter(void 0, void 0, void 0, function* () {
        const fromUserId = 1;
        const toUserId = 2;
        const response = yield (0, supertest_1.default)(server)
            .post('/api/feedback')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            fromUser: fromUserId,
            companyName: 'Company ABC',
            toUser: toUserId,
            context: 'This is the feedback content.',
        })
            .expect(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.from_user).toBe(fromUserId);
        expect(response.body.company_name).toBe('Company ABC');
        expect(response.body.to_user).toBe(toUserId);
        expect(response.body.content).toBe('This is the feedback content.');
    }));
    it('should fetch the list of feedbacks', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .get('/api/feedback')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(response.body).toBeInstanceOf(Array);
    }));
    it('should fetch the feedback by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const newFeedback = yield (0, supertest_1.default)(server)
            .post('/api/feedback')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            fromUser: 5,
            companyName: 'Company DFG',
            toUser: 6,
            context: 'This is the feedback content of 5.',
        })
            .expect(201);
        const feedbackId = parseInt(newFeedback.body.id);
        const response = yield (0, supertest_1.default)(server)
            .get(`/api/feedback/${feedbackId}`)
            .expect(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toBe(feedbackId);
        expect(response.body.company_name).toBe('Company DFG');
    }));
    it('should update feedback by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const newFeedback = yield (0, supertest_1.default)(server)
            .post('/api/feedback')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            fromUser: 2,
            companyName: 'Company HIJ',
            toUser: 9,
            context: 'This is the feedback content of 2.',
        })
            .expect(201);
        const feedbackId = parseInt(newFeedback.body.id);
        const response = yield (0, supertest_1.default)(server)
            .put(`/api/feedback/${feedbackId}`)
            .send({
            fromUser: 2,
            companyName: 'Company NEW HIJ',
            toUser: 9,
            context: 'This is the NEW feedback content of 2.',
        })
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toBe(feedbackId);
        expect(response.body.company_name).toBe('Company NEW HIJ');
    }));
    it('should delete feedback by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const newFeedback = yield (0, supertest_1.default)(server)
            .post('/api/feedback')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            fromUser: 3,
            companyName: 'Company KLM',
            toUser: 4,
            context: 'This is the feedback content of 3.',
        })
            .expect(201);
        const feedbackId = parseInt(newFeedback.body.id);
        yield (0, supertest_1.default)(server)
            .delete(`/api/feedback/${feedbackId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        yield (0, supertest_1.default)(server)
            .get(`/api/feedback/${feedbackId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(404);
    }));
});
//# sourceMappingURL=feedback.spec.js.map