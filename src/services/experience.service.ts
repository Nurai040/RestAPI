import { Experience } from '../models/experience.model';
import { UserRole } from '../models/user.model';
import { cachService } from './redis.service';

export class ExperienceService {
  async addExperience(req: any, res: any) {
    const log = req.log;
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
      await cachService.delByPattern('experience_*');
      await cachService.delByPattern(`cv_${user_id}`);

      log.info(`New experience with ${experience.id} id is created`);
      return res.status(201).json(experience);
    } catch (error) {
      log.error('Error with post /api/experience: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async getExperience(req: any, res: any) {
    const log = req.log;
    try {
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const cacheKey = `experience_${page}_${pageSize}`;
      const cacheData = await cachService.get(cacheKey);

      if(cacheData){
        log.info(`Returning cached data for fetching the experiences`);
        return res.status(200).json(cacheData);
      }
      const { count, rows } = await Experience.findAndCountAll({
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
      
      res.setHeader('X-total-count', count);

      const responseData =rows.map((user) => ({
        id: user.id,
        userId: user.user_id,
        companyName: user.company_name,
        role: user.role,
        startDate: user.startDate,
        endDate: user.endDate,
        description: user.description,
      }));

      await cachService.set(cacheKey, responseData, 7200);

      log.info('Fetching experiences');
      return res.status(200).json(responseData);
    } catch (error) {
      log.error('Error with get /api/experience: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async getExperienceById(req: any, res: any) {
    const log = req.log;
    try {
      const expId = parseInt(req.params.id);

      const cacheKey = `experience_${expId}`;
      const cacheData = await cachService.get(cacheKey);

      if(cacheData){
        log.info(`Returning cached data for fetching the experience with ${expId} id`); 
        return res.status(200).json(cacheData);
      }

      const currentExp = await Experience.findByPk(expId);
      if (!currentExp) {
        log.warn(`Experience with ${expId} id is not found`);
        return res.status(404).json({ message: 'Not found' });
      }
      await cachService.set(cacheKey, currentExp, 7200);
      log.info(`Fetching experience with ${expId} id`);
      return res.status(200).json(currentExp);
    } catch (error) {
      log.error('Error with get /api/experience/:id: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async updateExpById(req: any, res: any) {
    const log = req.log;
    try {
      const { userId, companyName, role, startDate, endDate, description } =
        req.body;
      const expId = parseInt(req.params.id);

      const currentExp = await Experience.findByPk(expId);

      if (!currentExp) {
        log.warn(`Experience with ${expId} id is not found`);
        return res.status(404).json({ message: 'Not found' });
      }
      if (
        req.user.id !== currentExp.user_id &&
        req.user.role !== UserRole.Admin
      ) {
        log.warn(`Unauthorized trying to update experience with ${expId} id`);
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
      await cachService.delByPattern('experience_*');
      await cachService.delByPattern(`cv_${userId}`);

      log.info(`The experience with ${expId} id is updated`);
      return res.status(200).json(currentExp);
    } catch (error) {
      log.error('Error with put /api/experience/:id: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }
  async deleteExpById(req: any, res: any) {
    const log = req.log;
    try {
      const expId = parseInt(req.params.id);

      const currentExp = await Experience.findByPk(expId);
      const user_id = currentExp.user_id;

      if (!currentExp) {
        log.warn(`Experience with ${expId} id is not found`);
        return res.status(404).json({ message: 'Not found' });
      }

      if (
        req.user.id !== currentExp.user_id &&
        req.user.role !== UserRole.Admin
      ) {
        log.warn(`Unauthorized trying to delete experience with ${expId} id`);
        return res
          .status(403)
          .json({ message: 'Unauthorized to delete this experience' });
      }

      await currentExp.destroy();
      await cachService.delByPattern('experience_*');
      await cachService.delByPattern(`cv_${user_id}`);

      log.info(`The experience with ${expId} id is deleted`); 
      return res.status(200).json({ message: 'The experience is deleted' });
    } catch (error) {
      log.error('Error with delete /api/experience/:id: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }
}
