"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const sequelize_1 = require("sequelize");
class Feedback extends sequelize_1.Model {
    static defineSchema(sequelize) {
        Feedback.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            from_user: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            to_user: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            content: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            company_name: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false,
            },
        }, {
            tableName: 'feedbacks',
            underscored: true,
            sequelize,
        });
    }
    static associate(models, sequelize) {
        Feedback.belongsTo(models.user, {
            foreignKey: 'from_user',
            as: 'FromUser',
        });
        Feedback.belongsTo(models.user, {
            foreignKey: 'to_user',
            as: 'ToUser',
        });
    }
}
exports.Feedback = Feedback;
//# sourceMappingURL=feedback.model.js.map