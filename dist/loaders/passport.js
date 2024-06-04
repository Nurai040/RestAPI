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
exports.loadPassport = void 0;
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const loadPassport = (app, context) => {
    app.use(passport_1.default.initialize());
    const jwtOptions = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'SECRET_KEY',
    };
    passport_1.default.use(new passport_local_1.Strategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findOne({ where: { email } });
            if (!user) {
                return done(null, false, { message: 'Invalid email' });
            }
            const validPass = bcrypt_1.default.compareSync(password, user.password);
            if (!validPass) {
                return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
        }
        catch (err) {
            console.error('Error with authentication: ', err);
            return done(err);
        }
    })));
    passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findByPk(jwt_payload.id);
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        }
        catch (err) {
            return done(err, false);
        }
    })));
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findByPk(id);
            done(null, user);
        }
        catch (error) {
            done(error);
        }
    }));
};
exports.loadPassport = loadPassport;
//# sourceMappingURL=passport.js.map