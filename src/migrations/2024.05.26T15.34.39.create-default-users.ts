import { MigrationFn } from 'umzug';
import { DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import { UserRole } from '../models/user.model';

export const up: MigrationFn<Sequelize> = async ({ context }) => {
  const q = context.getQueryInterface();

  await q.bulkInsert(
    'users',
    [
      {
        first_name: 'Admin',
        last_name: 'User',
        image: '../../public/default',
        email: 'admin@example.com',
        password: bcrypt.hashSync('admin', 7),
        title: "Admin",
        summary: "Admin summary",
        role: UserRole.Admin,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: 'Regular',
        last_name: 'User',
        image: '../../public/default',
        email: 'user@example.com',
        password: bcrypt.hashSync('user', 7),
        title: "Default regular user",
        summary: "Default regular user summary",
        role: 'User',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    {},
  );
};

export const down: MigrationFn<Sequelize> = async ({ context }) => {
  const q = context.getQueryInterface();

  await q.bulkDelete(
    'users',
    { email: ['admin@example.com', 'user@example.com'] },
    {},
  );
};
