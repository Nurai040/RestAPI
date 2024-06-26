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
    server = app.listen(3003, () => {
        console.log(`Test server is running on http://localhost:3003`);
    });
    return server;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.close();
    yield server.close();
}));
describe('Projects endpoint', () => {
    it('should create a new project', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .post('/api/projects')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            userId: 2,
            description: 'Project description of user 2',
        })
            .expect(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.user_id).toBe(2);
        expect(response.body.description).toBe('Project description of user 1');
    }));
    it('should fetch the list of projects', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server)
            .get('/api/projects')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(response.body).toBeInstanceOf(Array);
    }));
    it('should fetch the project by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const newProject = yield (0, supertest_1.default)(server)
            .post('/api/projects')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            userId: 3,
            description: 'Project description of user 3',
        })
            .expect(200);
        const projectID = parseInt(newProject.body.id);
        const response = yield (0, supertest_1.default)(server)
            .get(`/api/projects/${projectID}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.user_id).toBe(3);
        expect(response.body.description).toBe('Project description of user 3');
    }));
    it('should update project by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const newProject = yield (0, supertest_1.default)(server)
            .post('/api/projects')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            userId: 4,
            description: 'Project description of user 4',
        })
            .expect(200);
        const projectID = parseInt(newProject.body.id);
        const response = yield (0, supertest_1.default)(server)
            .put(`/api/projects/${projectID}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            userId: 4,
            description: 'NEW Project description of user 4',
        })
            .expect(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.user_id).toBe(4);
        expect(response.body.description).toBe('NEW Project description of user 4');
    }));
    it('should delete project by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const newProject = yield (0, supertest_1.default)(server)
            .post('/api/projects')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            userId: 5,
            description: 'Project description of user 5',
        })
            .expect(200);
        const projectID = parseInt(newProject.body.id);
        yield (0, supertest_1.default)(server)
            .delete(`/api/projects/${projectID}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        yield (0, supertest_1.default)(server)
            .get(`/api/projects/${projectID}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(404);
    }));
});
//# sourceMappingURL=project.spec.js.map