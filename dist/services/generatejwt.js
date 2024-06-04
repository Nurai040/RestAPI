"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(user) {
    const secretKey = 'SECRET_KEY';
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, secretKey, {
        expiresIn: '12h',
    });
    return token;
}
exports.generateToken = generateToken;
//# sourceMappingURL=generatejwt.js.map