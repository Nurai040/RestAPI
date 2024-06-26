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
exports.makeUserRouter = void 0;
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const role_1 = require("../middleware/role");
const user_model_1 = require("../models/user.model");
const express_validator_2 = require("express-validator");
const user_service_1 = require("../services/user.service");
const upload_1 = __importDefault(require("../middleware/upload"));
const redis_service_1 = require("../services/redis.service");
const makeUserRouter = (context) => {
    const router = express_1.default.Router();
    const userservice = new user_service_1.UserService();
    router.post('/users', [
        (0, express_validator_1.check)('email', "email shouldn't be empty")
            .notEmpty()
            .isString()
            .isLength({ max: 255 }),
        (0, express_validator_1.check)('email', 'not correct email').isEmail(),
        (0, express_validator_1.check)('password', 'Password should be length of >4 and <255').isLength({
            min: 4,
            max: 255,
        }),
        (0, express_validator_1.check)('firstName', 'The field with firstName should not be empty')
            .notEmpty()
            .isString()
            .isLength({ max: 128 }),
        (0, express_validator_1.check)('lastName', 'The field with lastName should not be empty')
            .notEmpty()
            .isString()
            .isLength({ max: 128 }),
        (0, express_validator_1.check)('role').isString().isLength({ max: 50 }),
        (0, express_validator_1.check)('title').isString().isLength({ max: 256 }),
        (0, express_validator_1.check)('summary').isString().isLength({ max: 256 }),
    ], passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const log = req.log;
        try {
            const errors = (0, express_validator_2.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Validation error', errors });
            }
            const user = yield userservice.addUser(req, res);
            return res.status(201).json(user);
        }
        catch (err) {
            log.error('Error on the path POST /api/users: ', { err });
            return res
                .status(505)
                .json({ message: 'Something went wrong on the server' });
        }
    }));
    router.get('/users', [
        (0, express_validator_1.query)('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
        (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).toInt(),
    ], passport_1.default.authenticate('jwt', { session: false }), (0, role_1.roles)([user_model_1.UserRole.Admin]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const log = req.log;
        try {
            const errors = (0, express_validator_2.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Validation error', errors });
            }
            yield userservice.getUsers(req, res);
        }
        catch (err) {
            log.error('Error with get /users', { err });
        }
    }));
    router.get('/users/:id', [(0, express_validator_1.param)('id').isInt().withMessage('ID must be an integer')], passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const log = req.log;
        try {
            const errors = (0, express_validator_2.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Validation error', errors });
            }
            const id = parseInt(req.params.id);
            const cacheKey = `users_${id}`;
            const cacheData = yield redis_service_1.cachService.get(cacheKey);
            if (cacheData) {
                log.info('User is fetched successfully');
                return res.status(200).json(cacheData);
            }
            const user = yield user_model_1.User.findByPk(id);
            if (!user) {
                log.warn(`User with ${id} is not found`);
                return res.status(404).json('Not found with this id');
            }
            yield redis_service_1.cachService.set(cacheKey, user, 7200);
            log.info('User is fetched successfully');
            return res.status(200).json(user);
        }
        catch (error) {
            log.error('Error with fetching user with id: ', { error });
            return res
                .status(505)
                .json({ message: 'Something went wrong on the server' });
        }
    }));
    router.put('/users/:id', [
        (0, express_validator_1.param)('id').isInt().withMessage('ID must be an integer'),
        (0, express_validator_1.check)('email', "email shouldn't be empty")
            .notEmpty()
            .isString()
            .isLength({ max: 255 }),
        (0, express_validator_1.check)('email', 'not correct email').isEmail(),
        (0, express_validator_1.check)('password', 'Password should be length of >4 and <255').isLength({
            min: 4,
            max: 255,
        }),
        (0, express_validator_1.check)('firstName', 'The field with firstName should not be empty')
            .notEmpty()
            .isString()
            .isLength({ max: 128 }),
        (0, express_validator_1.check)('lastName', 'The field with lastName should not be empty')
            .notEmpty()
            .isString()
            .isLength({ max: 128 }),
        (0, express_validator_1.check)('role').isString().isLength({ max: 50 }),
        (0, express_validator_1.check)('title').isString().isLength({ max: 256 }),
        (0, express_validator_1.check)('summary').isString().isLength({ max: 256 }),
    ], passport_1.default.authenticate('jwt', { session: false }), upload_1.default.single('profileImage'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const log = req.log;
        try {
            const errors = (0, express_validator_2.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Validation error', errors });
            }
            yield userservice.putUser(req, res);
        }
        catch (err) {
            log.error(`Error with put /users/${req.params.id}`);
        }
    }));
    router.delete('/users/:id', [(0, express_validator_1.param)('id').isInt().withMessage('ID must be an integer')], passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const log = req.log;
        try {
            const errors = (0, express_validator_2.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Validation error', errors });
            }
            const userID = parseInt(req.params.id);
            const user = yield user_model_1.User.findByPk(userID);
            const currentUser = req.user;
            if (!user) {
                log.warn(`User with ${userID} id is not found`);
                return res
                    .status(404)
                    .json({ message: 'User with this id is not found' });
            }
            if (currentUser.id !== user.id && currentUser.role !== user_model_1.UserRole.Admin) {
                log.warn(`Unauthorized to delete user with ${userID}`);
                return res
                    .status(403)
                    .json({ message: 'Unauthorized to delete this user' });
            }
            yield user.destroy();
            yield redis_service_1.cachService.delByPattern('users_*');
            yield redis_service_1.cachService.delByPattern(`cv_${userID}`);
            log.info('User is deleted');
            return res.status(204).json({ message: 'User is deleted!' });
        }
        catch (err) {
            log.error('Error with deleting user: ', { err });
            return res
                .status(505)
                .json({ message: 'Something went wrong on the server' });
        }
    }));
    return router;
};
exports.makeUserRouter = makeUserRouter;
//# sourceMappingURL=users.js.map