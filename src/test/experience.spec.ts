import request from 'supertest';
import { config } from '../config';
import { loadSequelize } from '../loaders/sequelize';
import { generateToken } from '../services/generatejwt';
import { UserRole } from '../models/user.model';
import { loadApp } from '../loaders/app';
import { Experience } from '../models/experience.model';

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
  server = app.listen(3004, () => {
    console.log(`Test server is running on http://localhost:3004`);
  });
  return server;
});

afterAll(async () => {
  await sequelize.close();
  await server.close();
});

beforeEach(async () => {
  await Experience.destroy({
    where: {},
  truncate: true
  })
});

afterEach(async () => {
  await Experience.destroy({
    where: {},
  truncate: true
  })
});

describe('Experience endpoint', () => {
  it('should create new experience', async () => {
    const startDate = new Date(2022, 0, 1).toISOString();
    const endDate = new Date(2023, 0, 1).toISOString();
    const response = await request(server)
      .post('/api/experience')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        user_id: 1,
        company_name: 'Company ABC',
        role: 'CEO',
        startDate: startDate,
        endDate: endDate,
        description: 'The description of CEO',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.role).toBe('CEO');
  });

  it('should fetch the list of experiences', async () => {
    const response = await request(server)
      .get('/api/experience')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should fetch experience by ID', async () => {
    const startDate = new Date(2022, 0, 1).toISOString();
    const endDate = new Date(2023, 0, 1).toISOString();
    const newExp = await request(server)
      .post('/api/experience')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        user_id: 2,
        company_name: 'Company Milka',
        role: 'Cook',
        startDate: startDate,
        endDate: endDate,
        description: 'The description of Cook',
      })
      .expect(201);

    const expId = parseInt(newExp.body.id);

    const response = await request(server)
      .get(`/api/experience/${expId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.id).toBe(expId);
    expect(response.body.role).toBe('Cook');
  });

  it('should update experience by ID', async () => {
    const startDate = new Date(2022, 0, 1).toISOString();
    const endDate = new Date(2023, 0, 1).toISOString();
    const newExp = await request(server)
      .post('/api/experience')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        user_id: 2,
        company_name: 'Company Mars',
        role: 'HR',
        startDate: startDate,
        endDate: endDate,
        description: 'The description of HR',
      })
      .expect(201);

    const expId = parseInt(newExp.body.id);

    const response = await request(server)
      .put(`/api/experience/${expId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        user_id: 2,
        company_name: 'Company Mars',
        role: 'HR Manager',
        startDate: startDate,
        endDate: endDate,
        description: 'The NEW description of HR Manager',
      })
      .expect(200);

    expect(response.body.id).toBe(expId);
    expect(response.body.role).toBe('HR Manager');
    expect(response.body.description).toBe('The NEW description of HR Manager');
  });

  it('should delete experience by ID', async () => {
    const startDate = new Date(2022, 0, 1).toISOString();
    const endDate = new Date(2023, 0, 1).toISOString();
    const newExp = await request(server)
      .post('/api/experience')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        user_id: 2,
        company_name: 'Company Apple',
        role: 'Engineer',
        startDate: startDate,
        endDate: endDate,
        description: 'The description of Engineer',
      })
      .expect(201);

    const expId = parseInt(newExp.body.id);

    await request(server)
      .delete(`/api/experience/${expId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(server)
      .get(`/api/experience/${expId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
