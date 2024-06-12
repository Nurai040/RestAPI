import { Project } from '../models/project.model';
import { UserRole } from '../models/user.model';
import { cachService } from './redis.service';

export class ProjectService {
  async createProject(req: any, res: any) {
    const log = req.log;
    try {
      const { userId, description } = req.body;
      let image = null;

      if (req.file) {
        image = req.file.filename;
      }

      const project = await Project.create({
        user_id: userId,
        image,
        description,
      });
      await cachService.delByPattern('project_*');
      await cachService.delByPattern(`cv_${userId}`);
      
      log.info(`NEW Project is created`);
      return res.status(200).json(project);
    } catch (error) {
      log.error('Error with creating project: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async getProject(req: any, res: any) {
    const log = req.log;
    try {
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const cacheKey = `project_${page}_${pageSize}`;
      const cacheData = await cachService.get(cacheKey);
      if(cacheData){
        log.info('Returning cached data in get /project route');
        return res.status(200).json(cacheData);
      }

      const { count, rows } = await Project.findAndCountAll({
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      res.setHeader('X-total-count', count);
      await cachService.set(cacheKey, rows, 7200);

      log.info('Fetching projects');
      return res.status(200).json(rows);
    } catch (error) {
      log.error('Error with fetching projects: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async getProjectById(req: any, res: any) {
    const log = req.log;
    try {
      const projectId = parseInt(req.params.id);
      const currentPrjct = await Project.findByPk(projectId);
      const cacheKey = `project_${projectId}`;
      const cacheData = await cachService.get(cacheKey);
      if(cacheData){
        log.info('Returning cached data on the route get /project/:id');
        return res.status(200).json(cacheData);
      }
      if (!currentPrjct) {
        return res.status(404).json({ messsage: 'Not found' });
      }
      await cachService.set(cacheKey, currentPrjct, 7200);
      log.info(`Fetching project with ${projectId}`);
      return res.statis(200).json(currentPrjct);
    } catch (error) {
      log.error('Error with fetching project by ID: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async updateProjectById(req: any, res: any) {
    const log = req.log;
    try {
      const projectId = parseInt(req.params.id);
      const currentPrjct = await Project.findByPk(projectId);

      const { userId, description } = req.body;

      let image = null;

      if (req.file) {
        image = req.file.filename;
      }

      if (!currentPrjct) {
        log.warn(`The project with ${projectId} id is not found`);
        return res.status(404).json({ messsage: 'Not found' });
      }

      if (
        currentPrjct.user_id !== req.user.id &&
        req.user.role !== UserRole.Admin
      ) {
        log.warn(`Unauthorized to update project with ${projectId} id`);
        return res
          .status(403)
          .json({ message: 'Unauthorized to update this project' });
      }

      if (userId) currentPrjct.user_id = userId;
      if (image) currentPrjct.image = image;
      if (description) currentPrjct.description = description;

      await currentPrjct.save();
      await cachService.delByPattern('project_*');
      await cachService.delByPattern(`cv_${userId}`)

      log.info(`Project with ${projectId} id is updated`);
      return res.status(200).json(currentPrjct);
    } catch (error) {
      log.error('Error with updating project by ID: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async deleteProjectById(req: any, res: any) {
    const log = req.log;
    try {
      const projectId = parseInt(req.params.id);
      const currentPrjct = await Project.findByPk(projectId);
      const userId = currentPrjct.user_id;
      if (!currentPrjct) {
        log.warn(`The project with ${projectId} id is not found`); 
        return res.status(404).json({ messsage: 'Not found' });
      }

      if (
        currentPrjct.user_id !== req.user.id &&
        req.user.role !== UserRole.Admin
      ) {
        return res
          .status(403)
          .json({ message: 'Unauthorized to delete this project' });
      }

      await currentPrjct.destroy();
      await cachService.delByPattern('project_*');
      await cachService.delByPattern(`cv_${userId}`);

      log.info(`Project with ${projectId} id is deleted`);

      return res.status(200).json({ message: 'Project is deleted!' });
    } catch (error) {
      log.error('Error with deleting project by ID: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }
}
