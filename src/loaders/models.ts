import {Models} from '../interfaces/general';
import {User} from '../models/user.model';
import {Feedback} from '../models/feedback.model';
import { Experience } from '../models/experience.model';
import { Project } from '../models/project.model';
import {Sequelize} from 'sequelize';


export const loadModels = (sequelize: Sequelize): Models => {
  const models: Models = {
    user: User,
    feedback: Feedback,
    experience: Experience,
    project: Project
  }

  for (const model of Object.values(models)) {
    model.defineSchema(sequelize);
  }

  for (const model of Object.values(models)) {
    model.associate(models, sequelize);
  }

  return models;
}
