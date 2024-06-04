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
exports.makeAuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const upload_1 = __importDefault(require("../middleware/upload"));
const express_validator_2 = require("express-validator");
const auth_service_1 = require("../services/auth.service");
const passport_1 = __importDefault(require("passport"));
const generatejwt_1 = require("../services/generatejwt");
const makeAuthRouter = (context) => {
    const router = express_1.default.Router();
    const authService = new auth_service_1.AuthService();
    // Define routes
    router.post('/register', [
        (0, express_validator_1.check)('email', "email shouldn't be empty").notEmpty(),
        (0, express_validator_1.check)('email', 'not correct email').isEmail(),
        (0, express_validator_1.check)('password', 'Password should be length of >4 and <10').isLength({
            min: 4,
            max: 10,
        }),
        (0, express_validator_1.check)('firstName', 'The field with firstName should not be empty').notEmpty(),
        (0, express_validator_1.check)('lastName', 'The field with firstName should not be empty').notEmpty(),
    ], upload_1.default.single('profileImage'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const error = (0, express_validator_2.validationResult)(req);
            if (!error.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: 'Error with validation of email or password!' });
            }
            const { firstName, lastName, image, title, summary, role, email, password, } = req.body;
            const user = yield authService.registration(firstName, lastName, title, summary, email, password, image);
            res.status(201).json(user);
        }
        catch (error) {
            if (error.message === 'Email already exists') {
                return res.status(400).json({ message: 'Email already exists' });
            }
            console.error('Error creating user: ', error);
            return res
                .status(505)
                .json({ message: 'Something went wrong on the servers' });
        }
    }));
    router.post('/login', (req, res, next) => {
        passport_1.default.authenticate('local', (err, user, info) => {
            if (err) {
                next(err);
                return res.status(505).json({ message: 'Internal server error' });
            }
            if (!user) {
                next(err);
                return res
                    .status(400)
                    .json({ message: 'Incorrect email or password' });
            }
            const token = (0, generatejwt_1.generateToken)(user);
            const filteredUserInfo = {
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    title: user.title,
                    summary: user.summary,
                    email: user.email,
                    image: user.image,
                },
                token: token,
            };
            return res.status(200).json(filteredUserInfo);
        })(req, res, next);
    });
    return router;
};
exports.makeAuthRouter = makeAuthRouter;
//# sourceMappingURL=auth.js.map