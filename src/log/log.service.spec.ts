import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { createMock } from '@golevelup/ts-jest';
import { SequelizeModule } from '@nestjs/sequelize';
import { Log } from './models/log.model';

describe('LogService', () => {
  let service: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogService],
      imports: [SequelizeModule.forFeature([Log])],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<LogService>(LogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
