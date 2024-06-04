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
exports.AuthService = void 0;
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    registration(firstName, lastName, title, summary, email, password, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield user_model_1.User.findOne({ where: { email } });
                if (candidate) {
                    const error = new Error('Email already exists');
                    throw error;
                }
                const role = user_model_1.UserRole.User;
                const hashPassword = bcrypt_1.default.hashSync(password, 7);
                const user = yield user_model_1.User.create({
                    firstName,
                    lastName,
                    image: image || '../../public/default.png',
                    title,
                    summary,
                    role,
                    email,
                    password: hashPassword,
                });
                return user;
            }
            catch (err) {
                console.error('Error creating user: ', err);
                throw err;
            }
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map