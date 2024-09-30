import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { usersMock2 } from './mocks/usersMock';
import { logsMock } from './mocks/logsMock';

describe('Logs', () => {
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
      .send(usersMock2);

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('login a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: usersMock2.email, password: usersMock2.password });
    accessToken = response.body.accessToken;
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.accessToken).toBeDefined();
  });

  it('should create logs', async () => {
    const response = await request(app.getHttpServer())
      .post('/logs')
      .send(logsMock)
      .set('Authorization', 'bearer ' + accessToken);
    expect(response.status).toBe(HttpStatus.CREATED);
  });
  it('should logs report', async () => {
    const response = await request(app.getHttpServer())
      .get('/logs/report')
      .set('Authorization', 'bearer ' + accessToken);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.infoCount).toBeGreaterThan(0);
  });
});
