import { User, UserRole } from '../models/user.model';
import upload from '../middleware/upload';
import bcrypt from 'bcrypt';

export class AuthService {
  async registration(
    firstName: string,
    lastName: string,
    title: string,
    summary: string,
    email: string,
    password: string,
    image?: string,
  ) {
    try {
      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        const error = new Error('Email already exists');
        throw error;
      }
      const role = UserRole.User;
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = await User.create({
        firstName,
        lastName,
        image: image || '../../public/default.png',
        title,
        summary,
        role,
        email,
        password: hashPassword,
      });
      return user;
    } catch (err) {
      console.error('Error creating user: ', err);
      throw err;
    }
  }
}
