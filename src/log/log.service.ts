import { Injectable } from '@nestjs/common';
import { SendLogRequest } from './dto/log.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Log } from './models/log.model';
import { ReportingResponse } from './dto/reporting.dto';
import { Op } from 'sequelize';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log) private logModel: typeof Log) {}

  async storeLogs(userId: number, logMessages: SendLogRequest): Promise<Log[]> {
    return await Promise.all(
      logMessages.map(async (logMessage) => {
        const containsLocalhostUrls = /http:\/\/localhost/.test(
          logMessage.text,
        );
        return this.logModel.create({
          userId,
          timestamp: logMessage.timestamp,
          level: logMessage.level,
          text: logMessage.text,
          containsLocalhostUrls,
        });
      }),
    );
  }

  async generateReport(
    startDate?: string,
    endDate?: string,
  ): Promise<ReportingResponse> {
    const whereClause: any = {};
    if (startDate) {
      whereClause.timestamp = { [Op.gte]: new Date(startDate) };
    }

    if (endDate) {
      whereClause.timestamp = {
        ...whereClause.timestamp,
        [Op.lte]: new Date(endDate),
      };
    }

    // Count the info logs in the period
    const infoCount = await this.logModel.count({
      where: {
        ...whereClause,
        level: 'info',
      },
    });

    // Count the warning logs in the period
    const warningCount = await this.logModel.count({
      where: {
        ...whereClause,
        level: 'warning',
      },
    });

    // Count the error logs in the period
    const errorCount = await this.logModel.count({
      where: {
        ...whereClause,
        level: 'error',
      },
    });

    // Count logs that contain localhost URLs in the period
    const messageWithUrlCount = await this.logModel.count({
      where: {
        ...whereClause,
        containsLocalhostUrls: true,
      },
    });

    return {
      startDate,
      endDate,
      infoCount,
      warningCount,
      errorCount,
      messageWithUrlCount,
    };
  }
}
