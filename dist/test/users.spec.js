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
const setUpTest_1 = require("../setUpTest");
const config_1 = require("../config");
const sequelize_1 = require("../loaders/sequelize");
const generatejwt_1 = require("../services/generatejwt");
const user_model_1 = require("../models/user.model");
let sequelize;
let app;
let adminToken;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    sequelize = (0, sequelize_1.loadSequelize)(config_1.config);
    yield sequelize.sync({ force: true });
    app = yield (0, setUpTest_1.setUpTest)();
    const adminUser = {
        id: 1,
        email: 'admin@example.com',
        role: user_model_1.UserRole.Admin,
    };
    adminToken = (0, generatejwt_1.generateToken)(adminUser);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.close();
    yield (0, setUpTest_1.tearDownTest)();
}));
describe('USERS endpoint', () => {
    describe('POST /users', () => {
        it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const adminUser = {
                id: 1,
                email: 'admin@example.com',
                role: user_model_1.UserRole.Admin,
            };
            const adminToken = (0, generatejwt_1.generateToken)(adminUser);
            const response = yield (0, supertest_1.default)(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                firstName: 'John',
                lastName: 'Doe',
                title: 'Developer',
                summary: 'Experienced developer',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'User',
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.firstName).toBe('John');
            expect(response.body.email).toBe('john.doe@example.com');
        }));
    });
    describe('GET /users', () => {
        it('should return the list of users', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(response.body).toBeInstanceOf(Array);
        }));
    });
    describe('GET /users/:id', () => {
        it('should return user by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = yield (0, supertest_1.default)(app)
                .post('/api/users')
                .send({
                firstName: 'Jane',
                lastName: 'Doe',
                title: 'Manager',
                summary: 'Experienced manager',
                email: 'jane.doe@example.com',
                password: 'password123',
                role: 'User',
            })
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(201);
            const userId = newUser.body.id;
            const response = yield (0, supertest_1.default)(app)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.id).toBe(userId);
            expect(response.body.firstName).toBe('Jane');
        }));
    });
    describe('PUT /users/:id', () => {
        it('should update a user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = yield (0, supertest_1.default)(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                firstName: 'Jake',
                lastName: 'Smith',
                title: 'Engineer',
                summary: 'Experienced engineer',
                email: 'jake.smith@example.com',
                password: 'password123',
                role: 'User',
            })
                .expect(201);
            const userId = parseInt(newUser.body.id);
            const curUser = (0, generatejwt_1.generateToken)(newUser.body);
            const response = yield (0, supertest_1.default)(app)
                .put(`/api/users/${userId}`)
                .send({
                firstName: 'Jacob',
                lastName: 'Smith',
                title: 'Senior Engineer',
                summary: 'Experienced senior engineer',
                email: 'jacobsmith@example.com',
                password: 'newpassword123',
                role: 'User',
            })
                .set('Authorization', `Bearer ${curUser}`)
                .expect(200);
            expect(response.body.firstName).toBe('Jacob');
            expect(response.body.title).toBe('Senior Engineer');
        }));
    });
    describe('DELETE /users/:id', () => {
        it('should delete a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = yield (0, supertest_1.default)(app)
                .post('/api/users')
                .send({
                firstName: 'Michael',
                lastName: 'Brown',
                title: 'Tester',
                summary: 'Experienced tester',
                email: 'michael.brown@example.com',
                password: 'password123',
                role: 'User',
            })
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(201);
            const userId = parseInt(newUser.body.id);
            yield (0, supertest_1.default)(app)
                .delete(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(204);
            yield (0, supertest_1.default)(app)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        }));
    });
});
//# sourceMappingURL=users.spec.js.map