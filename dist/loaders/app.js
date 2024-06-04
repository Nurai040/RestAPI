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
exports.loadApp = void 0;
const middlewares_1 = require("./middlewares");
const routes_1 = require("./routes");
const express_1 = __importDefault(require("express"));
const context_1 = require("./context");
const models_1 = require("./models");
const sequelize_1 = require("./sequelize");
const config_1 = require("../config");
const passport_1 = require("./passport");
const loadApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const sequelize = (0, sequelize_1.loadSequelize)(config_1.config);
    (0, models_1.loadModels)(sequelize);
    const context = yield (0, context_1.loadContext)();
    (0, passport_1.loadPassport)(app, context);
    (0, middlewares_1.loadMiddlewares)(app, context);
    (0, routes_1.loadRoutes)(app, context);
    return app;
});
exports.loadApp = loadApp;
//# sourceMappingURL=app.js.map