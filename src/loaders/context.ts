import { UserService } from '../services/user.service';
import { Context } from '../interfaces/general';
import { AuthService } from '../services/auth.service';
import { ExperienceService } from '../services/experience.service';
import { FeedbackService } from '../services/feedback.service';
import { ProjectService } from '../services/project.service';

export const loadContext = async (): Promise<Context> => {
  return {
    services: {
      authService: new AuthService(),
      userService: new UserService(),
      experienceService: new ExperienceService(),
      feedbackService: new FeedbackService(),
      projectService: new ProjectService(),
    },
  };
};
