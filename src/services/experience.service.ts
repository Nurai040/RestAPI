import { Experience } from '../models/experience.model';
import { UserRole } from '../models/user.model';

export class ExperienceService {
  async addExperience(req: any, res: any) {
    try {
      const { user_id, company_name, role, startDate, endDate, description } =
        req.body;
      const experience = await Experience.create({
        user_id,
        company_name,
        role,
        startDate,
        endDate,
        description,
      });
      return res.status(201).json(experience);
    } catch (error) {
      console.error('Error with post /api/experience: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async getExperience(req: any, res: any) {
    try {
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      const { count, rows } = await Experience.findAndCountAll({
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
      
      res.setHeader('X-total-count', count);
      return res.status(200).json(
        rows.map((user) => ({
          id: user.id,
          userId: user.user_id,
          companyName: user.company_name,
          role: user.role,
          startDate: user.startDate,
          endDate: user.endDate,
          description: user.description,
        })),
      );
    } catch (error) {
      console.error('Error with get /api/experience: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async getExperienceById(req: any, res: any) {
    try {
      const expId = parseInt(req.params.id);
      const currentExp = await Experience.findByPk(expId);
      if (!currentExp) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.status(200).json(currentExp);
    } catch (error) {
      console.error('Error with get /api/experience/:id: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async updateExpById(req: any, res: any) {
    try {
      const { userId, companyName, role, startDate, endDate, description } =
        req.body;
      const expId = parseInt(req.params.id);

      const currentExp = await Experience.findByPk(expId);

      if (!currentExp) {
        return res.status(404).json({ message: 'Not found' });
      }
      if (
        req.user.id !== currentExp.user_id &&
        req.user.role !== UserRole.Admin
      ) {
        return res
          .status(403)
          .json({ message: 'Unauthorized to update this experience' });
      }

      if (userId) currentExp.user_id = userId;
      if (companyName) currentExp.company_name = companyName;
      if (role) currentExp.role = role;
      if (startDate) currentExp.startDate = startDate;
      if (endDate) currentExp.endDate = endDate;
      if (description) currentExp.description = description;

      await currentExp.save();
      return res.status(200).json(currentExp);
    } catch (error) {
      console.error('Error with put /api/experience/:id: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }
  async deleteExpById(req: any, res: any) {
    try {
      const expId = parseInt(req.params.id);

      const currentExp = await Experience.findByPk(expId);

      if (!currentExp) {
        return res.status(404).json({ message: 'Not found' });
      }

      if (
        req.user.id !== currentExp.user_id &&
        req.user.role !== UserRole.Admin
      ) {
        return res
          .status(403)
          .json({ message: 'Unauthorized to delete this experience' });
      }

      await currentExp.destroy();
      return res.status(200).json({ message: 'The experience is deleted' });
    } catch (error) {
      console.error('Error with delete /api/experience/:id: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }
}
