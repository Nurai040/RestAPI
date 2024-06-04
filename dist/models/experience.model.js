"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Experience = void 0;
const sequelize_1 = require("sequelize");
class Experience extends sequelize_1.Model {
    static defineSchema(sequelize) {
        Experience.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            company_name: {
                type: new sequelize_1.DataTypes.STRING(256),
                allowNull: false,
            },
            role: {
                type: new sequelize_1.DataTypes.STRING(256),
                allowNull: false,
            },
            startDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                field: "startDate"
            },
            endDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                field: "endDate"
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
        }, {
            tableName: 'experiences',
            underscored: true,
            sequelize,
        });
    }
    static associate(models, sequelize) {
        Experience.belongsTo(models.user, {
            foreignKey: 'user_id',
        });
    }
}
exports.Experience = Experience;
//# sourceMappingURL=experience.model.js.map