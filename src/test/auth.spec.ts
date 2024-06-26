import request from 'supertest';
import { config } from '../config';
import { loadSequelize } from '../loaders/sequelize';
import { generateToken } from '../services/generatejwt';
import { UserRole } from '../models/user.model';
import { loadApp } from '../loaders/app';

let sequelize: any;
let server: any;
let adminToken: string;

beforeAll(async () => {
  sequelize = loadSequelize(config);
  await sequelize.sync({ force: true });

  const adminUser = {
    id: 1,
    email: 'admin@example.com',
    role: UserRole.Admin,
  };

  adminToken = generateToken(adminUser);
  const app = await loadApp();
  server = app.listen(3008, () => {
    console.log(`Test server is running on http://localhost:3006`);
  });
  return server;
});

afterAll(async () => {
  await sequelize.close();
  await server.close();
});

describe('AUTH endpoint', () => {
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .field('email', 'test@example.com')
        .field('password', 'password')
        .field('firstName', 'Test')
        .field('lastName', 'User')
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');
    });

    it('should not register a user with an existing email', async () => {
      await request(server)
        .post('/api/auth/register')
        .field('email', 'test2@example.com')
        .field('password', 'password')
        .field('firstName', 'Test2')
        .field('lastName', 'User2')
        .expect(201);

      const response = await request(server)
        .post('/api/auth/register')
        .field('email', 'test2@example.com')
        .field('password', 'password')
        .field('firstName', 'Test2')
        .field('lastName', 'User2')
        .expect(400);

      expect(response.body.message).toBe('Email already exists');
    });

    it('should not register a user with invalid data', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .field('email', 'invalid-email')
        .field('password', '123')
        .field('firstName', '')
        .field('lastName', '')
        .expect(400);

      expect(response.body.message).toBe(
        'Error with validation of email or password!',
      );
    });
  });

  describe('POST /login', () => {
    it('should log in an existing user with correct credentials', async () => {
      await request(server)
        .post('/api/auth/register')
        .field('email', 'login@example.com')
        .field('password', 'password')
        .field('firstName', 'Login')
        .field('lastName', 'User')
        .expect(201);

      const response = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'login@example.com');
    });

    it('should not log in a user with incorrect credentials', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        })
        .expect(400);

      expect(response.body.message).toBe('Incorrect email or password');
    });

    it('should not log in a non-existing user', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'nonexisting@example.com',
          password: 'password',
        })
        .expect(400);

      expect(response.body.message).toBe('Incorrect email or password');
    });
  });
});
