import request from 'supertest';
import { config } from '../config';
import { loadSequelize } from '../loaders/sequelize';
import { generateToken } from '../services/generatejwt';
import { UserRole } from '../models/user.model';
import { loadApp } from '../loaders/app';
import { Project } from '../models/project.model';

let sequelize: any;
let server: any;
let adminToken: string;

beforeAll(async () => {
  sequelize = await loadSequelize(config);
  await sequelize.sync({ force: true });

  const adminUser = {
    id: 1,
    email: 'admin@example.com',
    role: UserRole.Admin,
  };

  adminToken = generateToken(adminUser);
  const app = await loadApp();
  server = app.listen(3003, () => {
    console.log(`Test server is running on http://localhost:3003`);
  });
  return server;
});

afterAll(async () => {
  await sequelize.close();
  await server.close();
});
beforeEach(async () => {
  await Project.destroy({
    where: {},
  truncate: true
  })
});

afterEach(async () => {
  await Project.destroy({
    where: {},
  truncate: true
  })
});

describe('Projects endpoint', () => {
  it('should create a new project', async () => {
    const response = await request(server)
      .post('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: 2,
        description: 'Project description of user 2',
      })
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.user_id).toBe(2);
    expect(response.body.description).toBe('Project description of user 2');
  });

  it('should fetch the list of projects', async () => {
    const response = await request(server)
      .get('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should fetch the project by id', async () => {
    const newProject = await request(server)
      .post('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: 1,
        description: 'Project description of user 1',
      })
      .expect(200);

    const projectID = parseInt(newProject.body.id);

    const response = await request(server)
      .get(`/api/projects/${projectID}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.user_id).toBe(1);
    expect(response.body.description).toBe('Project description of user 1');
  });

  it('should update project by id', async () => {
    const newProject = await request(server)
      .post('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: 2,
        description: 'Project description of user 2',
      })
      .expect(200);

    const projectID = parseInt(newProject.body.id);

    const response = await request(server)
      .put(`/api/projects/${projectID}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: 2,
        description: 'NEW Project description of user 2',
      })
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.user_id).toBe(2);
    expect(response.body.description).toBe('NEW Project description of user 2');
  });

  it('should delete project by ID', async () => {
    const newProject = await request(server)
      .post('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: 2,
        description: 'Project description of user 2',
      })
      .expect(200);

    const projectID = parseInt(newProject.body.id);

    await request(server)
      .delete(`/api/projects/${projectID}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(server)
      .get(`/api/projects/${projectID}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
