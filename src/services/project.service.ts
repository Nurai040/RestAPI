import { Project } from '../models/project.model';
import { UserRole } from '../models/user.model';

export class ProjectService {
  async createProject(req: any, res: any) {
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
      return res.status(200).json(project);
    } catch (error) {
      console.error('Error with creating project: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async getProject(req: any, res: any) {
    try {
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      const { count, rows } = await Project.findAndCountAll({
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      res.setHeader('X-total-count', count);
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Error with fetching projects: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async getProjectById(req: any, res: any) {
    try {
      const projectId = parseInt(req.params.id);
      const currentPrjct = await Project.findByPk(projectId);

      if (!currentPrjct) {
        return res.status(404).json({ messsage: 'Not found' });
      }
      return res.statis(200).json(currentPrjct);
    } catch (error) {
      console.error('Error with fetching project by ID: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async updateProjectById(req: any, res: any) {
    try {
      const projectId = parseInt(req.params.id);
      const currentPrjct = await Project.findByPk(projectId);

      const { userId, description } = req.body;

      let image = null;

      if (req.file) {
        image = req.file.filename;
      }

      if (!currentPrjct) {
        return res.status(404).json({ messsage: 'Not found' });
      }

      if (
        currentPrjct.user_id !== req.user.id &&
        req.user.role !== UserRole.Admin
      ) {
        return res
          .status(403)
          .json({ message: 'Unauthorized to update this project' });
      }

      if (userId) currentPrjct.user_id = userId;
      if (image) currentPrjct.image = image;
      if (description) currentPrjct.description = description;

      await currentPrjct.save();

      return res.status(200).json(currentPrjct);
    } catch (error) {
      console.error('Error with updating project by ID: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async deleteProjectById(req: any, res: any) {
    try {
      const projectId = parseInt(req.params.id);
      const currentPrjct = await Project.findByPk(projectId);

      if (!currentPrjct) {
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

      return res.status(200).json({ message: 'Project is deleted!' });
    } catch (error) {
      console.error('Error with deleting project by ID: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }
}
