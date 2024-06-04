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
exports.UserService = void 0;
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, title, summary, email, password, role } = req.body;
            const hashPassword = bcrypt_1.default.hashSync(password, 7);
            const user = yield user_model_1.User.create({
                firstName,
                lastName,
                image: '../../public/default.png',
                title,
                summary,
                email,
                password: hashPassword,
                role,
            });
            return user;
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageSize = parseInt(req.query.pageSize) || 10;
            const page = parseInt(req.query.page) || 1;
            try {
                const { count, rows } = yield user_model_1.User.findAndCountAll({
                    limit: pageSize,
                    offset: (page - 1) * pageSize,
                });
                res.setHeader('X-total-count', count);
                return res.status(200).json(rows.map((user) => ({
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    title: user.title,
                    summary: user.summary,
                    email: user.email,
                    role: user.role,
                })));
            }
            catch (error) {
                console.error('Error with fetching users:  ', error);
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
    putUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, title, summary, email, password, role } = req.body;
                const userID = parseInt(req.params.id);
                const currentUser = req.user;
                if (currentUser.id !== userID) {
                    return res.status(400).json({ message: 'Forbidden!' });
                }
                const user = yield user_model_1.User.findByPk(userID);
                if (!user) {
                    return res
                        .status(404)
                        .json({ message: 'User with this ID is not found!' });
                }
                if (firstName)
                    user.firstName = firstName;
                if (lastName)
                    user.lastName = lastName;
                if (title)
                    user.title = title;
                if (summary)
                    user.summary = summary;
                if (email)
                    user.email = email;
                if (password)
                    user.password = bcrypt_1.default.hashSync(password, 7);
                if (role)
                    user.role = role;
                if (req.file) {
                    user.image = req.file.filename;
                }
                yield user.save();
                return res.status(200).json({
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    title: user.title,
                    summary: user.summary,
                    email: user.email,
                    role: user.role,
                });
            }
            catch (err) {
                console.error('Error with put /user/:id ', err);
                return res
                    .status(505)
                    .json({ message: 'Something went wrong on the server' });
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map