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
    server = app.listen(3008, () => {
        console.log(`Test server is running on http://localhost:3006`);
    });
    return server;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.close();
    yield server.close();
}));
describe('AUTH endpoint', () => {
    describe('POST /register', () => {
        it('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server)
                .post('/api/auth/register')
                .field('email', 'test@example.com')
                .field('password', 'password')
                .field('firstName', 'Test')
                .field('lastName', 'User')
                .expect(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe('test@example.com');
        }));
        it('should not register a user with an existing email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(server)
                .post('/api/auth/register')
                .field('email', 'test2@example.com')
                .field('password', 'password')
                .field('firstName', 'Test2')
                .field('lastName', 'User2')
                .expect(201);
            const response = yield (0, supertest_1.default)(server)
                .post('/api/auth/register')
                .field('email', 'test2@example.com')
                .field('password', 'password')
                .field('firstName', 'Test2')
                .field('lastName', 'User2')
                .expect(400);
            expect(response.body.message).toBe('Email already exists');
        }));
        it('should not register a user with invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server)
                .post('/api/auth/register')
                .field('email', 'invalid-email')
                .field('password', '123')
                .field('firstName', '')
                .field('lastName', '')
                .expect(400);
            expect(response.body.message).toBe('Error with validation of email or password!');
        }));
    });
    describe('POST /login', () => {
        it('should log in an existing user with correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(server)
                .post('/api/auth/register')
                .field('email', 'login@example.com')
                .field('password', 'password')
                .field('firstName', 'Login')
                .field('lastName', 'User')
                .expect(201);
            const response = yield (0, supertest_1.default)(server)
                .post('/api/auth/login')
                .send({
                email: 'login@example.com',
                password: 'password',
            })
                .expect(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('email', 'login@example.com');
        }));
        it('should not log in a user with incorrect credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server)
                .post('/api/auth/login')
                .send({
                email: 'login@example.com',
                password: 'wrongpassword',
            })
                .expect(400);
            expect(response.body.message).toBe('Incorrect email or password');
        }));
        it('should not log in a non-existing user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server)
                .post('/api/auth/login')
                .send({
                email: 'nonexisting@example.com',
                password: 'password',
            })
                .expect(400);
            expect(response.body.message).toBe('Incorrect email or password');
        }));
    });
});
//# sourceMappingURL=auth.spec.js.map