import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { createMock } from '@golevelup/ts-jest';
import { SequelizeModule } from '@nestjs/sequelize';
import { Log } from './models/log.model';

describe('LogController', () => {
  let controller: LogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogController],
      providers: [LogService],
      imports: [SequelizeModule.forFeature([Log])],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<LogController>(LogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
