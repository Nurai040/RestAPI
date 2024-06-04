"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const sequelize_1 = require("sequelize");
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "Admin";
    UserRole["User"] = "User";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
class User extends sequelize_1.Model {
    static defineSchema(sequelize) {
        User.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                field: 'first_name',
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false,
            },
            lastName: {
                field: 'last_name',
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
        }, {
            tableName: 'users',
            underscored: true,
            sequelize,
        });
    }
    static associate(models, sequelize) {
        // Example of how to define a association.
        User.hasMany(models.project, {
            foreignKey: 'user_id',
        });
        User.hasMany(models.experience, {
            foreignKey: 'user_id',
        });
        User.hasMany(models.feedback, {
            foreignKey: 'from_user',
            as: 'FromUser',
        });
        User.hasMany(models.feedback, {
            foreignKey: 'to_user',
            as: 'ToUser',
        });
    }
}
exports.User = User;
//# sourceMappingURL=user.model.js.map