import { User, UserRole } from '../models/user.model';
import upload from '../middleware/upload';
import bcrypt from 'bcrypt';
import { cachService } from './redis.service';

export class UserService {
  async addUser(req: any, res: any) {
    const { firstName, lastName, title, summary, email, password, role } =
      req.body;
    const hashPassword = bcrypt.hashSync(password, 7);
    const log = req.log;

    const user = await User.create({
      firstName,
      lastName,
      image: '../../public/default.png',
      title,
      summary,
      email,
      password: hashPassword,
      role,
    });

    await cachService.delByPattern('users_*');
    await cachService.delByPattern(`cv_${user.id}`);

    log.info("User is added");
    return user;
  }

  async getUsers(req: any, res: any) {
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const cacheKey = `users_${page}_${pageSize}`;
      const log = req.log;
    try {
      const cachedData = await cachService.get(cacheKey);
      if(cachedData){
        log.info("Cached data is fetched");
        return res.status(200).json(cachedData);
      }

      const { count, rows } = await User.findAndCountAll({
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
      res.setHeader('X-total-count', count);

      const responseData = rows.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        summary: user.summary,
        email: user.email,
        role: user.role,
      }));

      await cachService.set(cacheKey, responseData, 7200);
      log.info("Users are fetched");
      return res.status(200).json(responseData);
    } catch (error) {
      log.error('Error with fetching users:  ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async putUser(req: any, res: any) {
    const log = req.log;
    try {
      const { firstName, lastName, title, summary, email, password, role } =
        req.body;

      const userID = parseInt(req.params.id);

      const currentUser = req.user;

      if (currentUser.id !== userID) {
        log.warn(`Forbidden to update the user with ${userID} id`);
        return res.status(400).json({ message: 'Forbidden!' });
      }

      const user = await User.findByPk(userID);

      if (!user) {
        log.warn(`User with ${userID} is not found`);
        return res
          .status(404)
          .json({ message: 'User with this ID is not found!' });
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (title) user.title = title;
      if (summary) user.summary = summary;
      if (email) user.email = email;
      if (password) user.password = bcrypt.hashSync(password, 7);
      if (role) user.role = role;

      if (req.file) {
        user.image = req.file.filename;
      }

      await user.save();
      await cachService.delByPattern('users_*');
      await cachService.delByPattern(`cv_${userID}`);

      log.info(`User with ${userID} is updated`);
      
      return res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        summary: user.summary,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      console.error('Error with put /user/:id ', err);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }
}
