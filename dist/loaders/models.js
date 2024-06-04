"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModels = void 0;
const user_model_1 = require("../models/user.model");
const feedback_model_1 = require("../models/feedback.model");
const experience_model_1 = require("../models/experience.model");
const project_model_1 = require("../models/project.model");
const loadModels = (sequelize) => {
    const models = {
        user: user_model_1.User,
        feedback: feedback_model_1.Feedback,
        experience: experience_model_1.Experience,
        project: project_model_1.Project,
    };
    for (const model of Object.values(models)) {
        model.defineSchema(sequelize);
    }
    for (const model of Object.values(models)) {
        model.associate(models, sequelize);
    }
    return models;
};
exports.loadModels = loadModels;
//# sourceMappingURL=models.js.map