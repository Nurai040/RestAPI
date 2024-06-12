import request from 'supertest';
import { config } from '../config';
import { loadSequelize } from '../loaders/sequelize';
import { generateToken } from '../services/generatejwt';
import { loadApp } from '../loaders/app';
import { User, UserRole } from '../models/user.model';
import { Project } from '../models/project.model';
import { Feedback } from '../models/feedback.model';
import { Experience } from '../models/experience.model';

let sequelize:any;
let server:any;
let adminToken: string;

beforeAll(async () => {
  sequelize = loadSequelize(config);
  await sequelize.sync({ force: true });
  
  const adminUser = {
    id: 1,
    email: 'admin@example.com',
    role: UserRole.Admin
  };

  adminToken = generateToken(adminUser);
  const app = await loadApp();
  server = app.listen(3005, () => {
    console.log(`Test server is running on http://localhost:3005`);
  });

  await User.create({
    id: 1,
    email: 'user1@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.User,
    password: 'example123',
    title: 'example',
    summary: 'example',
    image:'example'
  });

  await Project.create({
    id: 1,
    user_id: 1,
    image: 'example',
    description: 'Description of Project 1'
  });

  await Feedback.create({
    id: 1,
    from_user: 2,
    to_user: 1,
    company_name: 'Company 1',
    content: 'Feedback for user 1'
  });

  await Experience.create({
    id: 1,
    user_id: 1,
    company_name: 'Company 1',
    role: 'Developer',
    startDate: new Date(),
    endDate: new Date(),
    description: 'Worked as a developer'
  });

  return server;
});

afterAll(async () => {
  await sequelize.close();
  await server.close();
});


describe('CV endpoint', ()=>{
    it('should return a CV for a valid user ID', async () => {
        const userId = 1; 
    
        const response = await request(server)
          .get(`/user/${userId}/cv`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
    
        expect(response.body).toHaveProperty('id', userId);
        expect(response.body).toHaveProperty('Projects');
        expect(response.body).toHaveProperty('ToUser');
        expect(response.body).toHaveProperty('Experiences');
      });
    
      it('should return 400 for invalid user ID', async () => {
        const invalidUserId = 'abc'; // Invalid user ID
    
        const response = await request(server)
          .get(`/user/${invalidUserId}/cv`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(400);
    
        expect(response.body).toHaveProperty('message', 'Validation error');
      });
    
      it('should return 404 if user is not found', async () => {
        const nonExistentUserId = 9999; // Assuming this user ID does not exist
    
        const response = await request(server)
          .get(`/user/${nonExistentUserId}/cv`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);
    
        expect(response.body).toHaveProperty('message', 'Not found');
      });
})