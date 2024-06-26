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
const app_1 = require("../loaders/app");
const user_model_1 = require("../models/user.model");
const project_model_1 = require("../models/project.model");
const feedback_model_1 = require("../models/feedback.model");
const experience_model_1 = require("../models/experience.model");
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
    server = app.listen(3005, () => {
        console.log(`Test server is running on http://localhost:3005`);
    });
    yield user_model_1.User.create({
        id: 1,
        email: 'user1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: user_model_1.UserRole.User,
        password: 'example123',
        title: 'example',
        summary: 'example',
        image: 'example',
    });
    yield project_model_1.Project.create({
        id: 1,
        user_id: 1,
        image: 'example',
        description: 'Description of Project 1',
    });
    yield feedback_model_1.Feedback.create({
        id: 1,
        from_user: 2,
        to_user: 1,
        company_name: 'Company 1',
        content: 'Feedback for user 1',
    });
    yield experience_model_1.Experience.create({
        id: 1,
        user_id: 1,
        company_name: 'Company 1',
        role: 'Developer',
        startDate: new Date(),
        endDate: new Date(),
        description: 'Worked as a developer',
    });
    return server;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.close();
    yield server.close();
}));
describe('CV endpoint', () => {
    it('should return a CV for a valid user ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 1;
        const response = yield (0, supertest_1.default)(server)
            .get(`/user/${userId}/cv`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(response.body).toHaveProperty('id', userId);
        expect(response.body).toHaveProperty('Projects');
        expect(response.body).toHaveProperty('ToUser');
        expect(response.body).toHaveProperty('Experiences');
    }));
    it('should return 400 for invalid user ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidUserId = 'abc'; // Invalid user ID
        const response = yield (0, supertest_1.default)(server)
            .get(`/user/${invalidUserId}/cv`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(400);
        expect(response.body).toHaveProperty('message', 'Validation error');
    }));
    it('should return 404 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentUserId = 9999; // Assuming this user ID does not exist
        const response = yield (0, supertest_1.default)(server)
            .get(`/user/${nonExistentUserId}/cv`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(404);
        expect(response.body).toHaveProperty('message', 'Not found');
    }));
});
//# sourceMappingURL=cv.spec.js.map