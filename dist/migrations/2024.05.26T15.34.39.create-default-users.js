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
exports.down = exports.up = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const up = ({ context }) => __awaiter(void 0, void 0, void 0, function* () {
    const q = context.getQueryInterface();
    yield q.bulkInsert('users', [
        {
            first_name: 'Admin',
            last_name: 'User',
            image: '../../public/default',
            email: 'admin@example.com',
            password: bcrypt_1.default.hashSync('admin', 7),
            title: "Admin",
            summary: "Admin summary",
            role: user_model_1.UserRole.Admin,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            first_name: 'Regular',
            last_name: 'User',
            image: '../../public/default',
            email: 'user@example.com',
            password: bcrypt_1.default.hashSync('user', 7),
            title: "Default regular user",
            summary: "Default regular user summary",
            role: 'User',
            created_at: new Date(),
            updated_at: new Date(),
        },
    ], {});
});
exports.up = up;
const down = ({ context }) => __awaiter(void 0, void 0, void 0, function* () {
    const q = context.getQueryInterface();
    yield q.bulkDelete('users', { email: ['admin@example.com', 'user@example.com'] }, {});
});
exports.down = down;
//# sourceMappingURL=2024.05.26T15.34.39.create-default-users.js.map