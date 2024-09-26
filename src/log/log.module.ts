import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Log } from './models/log.model';

@Module({
  imports: [SequelizeModule.forFeature([Log])],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
