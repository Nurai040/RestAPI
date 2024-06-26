import request from 'supertest';
import { config } from '../config';
import { loadSequelize } from '../loaders/sequelize';
import { generateToken } from '../services/generatejwt';
import { UserRole } from '../models/user.model';
import { loadApp } from '../loaders/app';
import { Feedback } from '../models/feedback.model';

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
  server = app.listen(3002, () => {
    console.log(`Test server is running on http://localhost:3002`);
  });
  return server;
});

afterAll(async () => {
  await sequelize.close();
  await server.close();
});
beforeEach(async () => {
  await Feedback.destroy({
    where: {},
  truncate: true
  })
});

afterEach(async () => {
  await Feedback.destroy({
    where: {},
  truncate: true
  })
});

describe('FEEDBACK endpoint', () => {
  it('should create a new feedback', async () => {
    const fromUserId = 1;
    const toUserId = 2;

    const response = await request(server)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fromUser: fromUserId,
        companyName: 'Company ABC',
        toUser: toUserId,
        context: 'This is the feedback content.',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.from_user).toBe(fromUserId);
    expect(response.body.company_name).toBe('Company ABC');
    expect(response.body.to_user).toBe(toUserId);
    expect(response.body.content).toBe('This is the feedback content.');
  });

  it('should fetch the list of feedbacks', async () => {
    const response = await request(server)
      .get('/api/feedback')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should fetch the feedback by id', async () => {
    const newFeedback = await request(server)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fromUser: 2,
        companyName: 'Company DFG',
        toUser: 1,
        context: 'This is the feedback content of 2.',
      })
      .expect(201);

    const feedbackId = parseInt(newFeedback.body.id);

    const response = await request(server)
      .get(`/api/feedback/${feedbackId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(feedbackId);
    expect(response.body.company_name).toBe('Company DFG');
  });

  it('should update feedback by ID', async () => {
    const newFeedback = await request(server)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fromUser: 2,
        companyName: 'Company HIJ',
        toUser: 1,
        context: 'This is the feedback content of 2.',
      })
      .expect(201);

    const feedbackId = parseInt(newFeedback.body.id);

    const response = await request(server)
      .put(`/api/feedback/${feedbackId}`)
      .send({
        fromUser: 2,
        companyName: 'Company NEW HIJ',
        toUser: 1,
        context: 'This is the NEW feedback content of 2.',
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(feedbackId);
    expect(response.body.company_name).toBe('Company NEW HIJ');
  });

  it('should delete feedback by ID', async () => {
    const newFeedback = await request(server)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fromUser: 2,
        companyName: 'Company KLM',
        toUser: 1,
        context: 'This is the feedback content of 2.',
      })
      .expect(201);

    const feedbackId = parseInt(newFeedback.body.id);

    await request(server)
      .delete(`/api/feedback/${feedbackId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(server)
      .get(`/api/feedback/${feedbackId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
