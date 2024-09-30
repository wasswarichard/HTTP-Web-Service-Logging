import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { usersMock1 } from './mocks/usersMock';

describe('Users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  let accessToken;

  it('should create a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send(usersMock1);

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('login a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: usersMock1.email, password: usersMock1.password });
    accessToken = response.body.accessToken;
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.accessToken).toBeDefined();
  });

  it('find all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'bearer ' + accessToken);
    expect(response.status).toBe(HttpStatus.OK);
  });
});
