import { Context, RouterFactory } from '../interfaces/general';
import express from 'express';
import { User, UserRole } from '../models/user.model';
import { Project } from '../models/project.model';
import { Feedback } from '../models/feedback.model';
import { Experience } from '../models/experience.model';

export const makeCVRouter = (context: Context) => {
  const router = express.Router();

  router.get('/user/:userId/cv', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'Not found' });
      }

      const projects = await Project.findAll({ where: { user_id: userId } });
      const feedbacks = await Feedback.findAll({ where: { to_user: userId } });
      const experiences = await Experience.findAll({
        where: { user_id: userId },
      });

      return res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        image: user.image,
        summary: user.summary,
        email: user.email,
        experiences,
        projects,
        feedbacks,
      });
    } catch (error) {
      console.error('Error with fetching the CV: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  });
  return router;
};
