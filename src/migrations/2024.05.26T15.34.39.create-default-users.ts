import { MigrationFn } from 'umzug';
import { DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import { UserRole } from '../models/user.model';

export const up: MigrationFn<Sequelize> = async ({context}) => {
    const q = context.getQueryInterface();

    await q.bulkInsert('users', [{
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('admin', 7),
        role: UserRole.Admin,
        created_at: new Date(),
        updated_at: new Date()
    },{
        firstName: 'Regular',
        lastName: 'User',
        email: 'user@example.com',
        password: bcrypt.hashSync('user', 7),
        role: 'User',
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {});
};

export const down: MigrationFn<Sequelize> = async ({context}) => {
    const q = context.getQueryInterface();

    await q.bulkDelete('users', {email: ['admin@example.com', 'user@example.com']}, {});
};
