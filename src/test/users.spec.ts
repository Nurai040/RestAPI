import request from 'supertest';
import { setUpTest, tearDownTest } from '../setUpTest';
import { config } from '../config';
import { loadSequelize } from '../loaders/sequelize';
import { generateToken } from '../services/generatejwt';
import { UserRole } from '../models/user.model';

let sequelize:any;
let app:any;
let adminToken: string;

beforeAll(async () => {
  sequelize = loadSequelize(config);
  await sequelize.sync({ force: true });
  app = await setUpTest();
  const adminUser = {
    id: 1,
    email: 'admin@example.com',
    role: UserRole.Admin
  };

  adminToken = generateToken(adminUser);
});

afterAll(async () => {
  await sequelize.close();
  await tearDownTest();
});

describe('USERS endpoint', ()=>{
    describe('POST /users', ()=>{
        it('should create a new user', async()=>{
          const adminUser = {
            id: 1,
            email: 'admin@example.com',
            role: UserRole.Admin
          };
    
            const adminToken = generateToken(adminUser);

            const response = await request(app).post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                firstName: 'John',
                lastName: 'Doe',
                title: 'Developer',
                summary: 'Experienced developer',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'User',
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.firstName).toBe('John');
            expect(response.body.email).toBe('john.doe@example.com');
        }); 
    });
    describe('GET /users', ()=>{
        it('should return the list of users', async()=>{
            const response = await request(app).get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
            expect(response.body).toBeInstanceOf(Array);
        })
    });
    describe('GET /users/:id', ()=>{
        it('should return user by id', async()=>{
            const newUser = await request(app)
      .post('/api/users')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        title: 'Manager',
        summary: 'Experienced manager',
        email: 'jane.doe@example.com',
        password: 'password123',
        role: 'User',
      }).set('Authorization', `Bearer ${adminToken}`)
      .expect(201);

            const userId = newUser.body.id;
            const response = await request(app).get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.id).toBe(userId);
            expect(response.body.firstName).toBe('Jane');
        })
    });

    describe('PUT /users/:id', ()=>{
        it('should update a user by ID', async()=>{
            const newUser = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Jake',
        lastName: 'Smith',
        title: 'Engineer',
        summary: 'Experienced engineer',
        email: 'jake.smith@example.com',
        password: 'password123',
        role: 'User',
      })
      .expect(201);

    const userId = parseInt(newUser.body.id);

    const curUser = generateToken(newUser.body);

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        firstName: 'Jacob',
        lastName: 'Smith',
        title: 'Senior Engineer',
        summary: 'Experienced senior engineer',
        email: 'jacobsmith@example.com',
        password: 'newpassword123',
        role: 'User',
      })
      .set('Authorization', `Bearer ${curUser}`)
      .expect(200);

    expect(response.body.firstName).toBe('Jacob');
    expect(response.body.title).toBe('Senior Engineer');
        })
    });

    describe('DELETE /users/:id', ()=>{
        it('should delete a user', async () => {
            const newUser = await request(app)
              .post('/api/users')
              .send({
                firstName: 'Michael',
                lastName: 'Brown',
                title: 'Tester',
                summary: 'Experienced tester',
                email: 'michael.brown@example.com',
                password: 'password123',
                role: 'User',
              })
              .set('Authorization', `Bearer ${adminToken}`)
              .expect(201);
        
            const userId = parseInt(newUser.body.id);
        
            await request(app)
              .delete(`/api/users/${userId}`)
              .set('Authorization', `Bearer ${adminToken}`) 
              .expect(204);
        
            await request(app)
              .get(`/api/users/${userId}`)
              .set('Authorization', `Bearer ${adminToken}`)
              .expect(404);
          });
    })
});
