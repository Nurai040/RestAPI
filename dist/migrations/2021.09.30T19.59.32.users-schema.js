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
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const sequelize_1 = require("sequelize");
const up = ({ context }) => __awaiter(void 0, void 0, void 0, function* () {
    const q = context.getQueryInterface();
    yield q.createTable('users', {
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
        last_name: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
        },
        image: {
            type: new sequelize_1.DataTypes.STRING(256),
            allowNull: false,
        },
        title: {
            type: new sequelize_1.DataTypes.STRING(256),
            allowNull: false,
        },
        summary: {
            type: new sequelize_1.DataTypes.STRING(256),
            allowNull: false,
        },
        role: {
            type: new sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        created_at: sequelize_1.DataTypes.DATE,
        updated_at: sequelize_1.DataTypes.DATE,
    });
});
exports.up = up;
const down = ({ context }) => __awaiter(void 0, void 0, void 0, function* () {
    const q = context.getQueryInterface();
    yield q.dropTable('users');
});
exports.down = down;
//# sourceMappingURL=2021.09.30T19.59.32.users-schema.js.map