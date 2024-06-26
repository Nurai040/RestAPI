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
    server = app.listen(3004, () => {
        console.log(`Test server is running on http://localhost:3004`);
    });
    return server;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.close();
    yield server.close();
}));
describe('Experience endpoint', () => {
    it('should create new experience', () => __awaiter(void 0, void 0, void 0, function* () {
        const startDate = new Date(2022, 0, 1).toISOString();
        const endDate = new Date(2023, 0, 1).toISOString();
        const response = yield (0, supertest_1.default)(server)
            .post('/api/experience')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            user_id: 1,
            company_name: 'Company ABC',
            role: 'CEO',
            startDate: startDate,
            endDate: endDate,
            description: 'The description of CEO',
        })
            .expect(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.role).toBe('CEO');
    }));
    it('should fetch the list of experiences', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .get('/api/experience')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(response.body).toBeInstanceOf(Array);
    }));
    it('should fetch experience by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const startDate = new Date(2022, 0, 1).toISOString();
        const endDate = new Date(2023, 0, 1).toISOString();
        const newExp = yield (0, supertest_1.default)(server)
            .post('/api/experience')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            user_id: 2,
            company_name: 'Company Milka',
            role: 'Cook',
            startDate: startDate,
            endDate: endDate,
            description: 'The description of Cook',
        })
            .expect(201);
        const expId = parseInt(newExp.body.id);
        const response = yield (0, supertest_1.default)(server)
            .get(`/api/experience/${expId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(response.body.id).toBe(expId);
        expect(response.body.role).toBe('Cook');
    }));
    it('should update experience by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const startDate = new Date(2022, 0, 1).toISOString();
        const endDate = new Date(2023, 0, 1).toISOString();
        const newExp = yield (0, supertest_1.default)(server)
            .post('/api/experience')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            user_id: 3,
            company_name: 'Company Mars',
            role: 'HR',
            startDate: startDate,
            endDate: endDate,
            description: 'The description of HR',
        })
            .expect(201);
        const expId = parseInt(newExp.body.id);
        const response = yield (0, supertest_1.default)(server)
            .put(`/api/experience/${expId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            user_id: 3,
            company_name: 'Company Mars',
            role: 'HR Manager',
            startDate: startDate,
            endDate: endDate,
            description: 'The NEW description of HR Manager',
        })
            .expect(200);
        expect(response.body.id).toBe(expId);
        expect(response.body.role).toBe('HR Manager');
        expect(response.body.description).toBe('The NEW description of HR Manager');
    }));
    it('should delete experience by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const startDate = new Date(2022, 0, 1).toISOString();
        const endDate = new Date(2023, 0, 1).toISOString();
        const newExp = yield (0, supertest_1.default)(server)
            .post('/api/experience')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            user_id: 4,
            company_name: 'Company Apple',
            role: 'Engineer',
            startDate: startDate,
            endDate: endDate,
            description: 'The description of Engineer',
        })
            .expect(201);
        const expId = parseInt(newExp.body.id);
        yield (0, supertest_1.default)(server)
            .delete(`/api/experience/${expId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        yield (0, supertest_1.default)(server)
            .get(`/api/experience/${expId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(404);
    }));
});
//# sourceMappingURL=experience.spec.js.map