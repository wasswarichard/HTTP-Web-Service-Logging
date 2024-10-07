import { BadRequestException, Injectable } from '@nestjs/common';
import { LogLevelEnum, SendLogRequest } from './dto/log.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Log } from './models/log.model';
import { ReportingResponse } from './dto/reporting.dto';
import { Op } from 'sequelize';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log) private logModel: typeof Log,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async storeLogs(userId: number, logMessages: SendLogRequest): Promise<Log[]> {
    const MAX_LOG_SIZE = 100 * 1024; // 100 KB per log message
    const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5 MB total

    // Use reduce to calculate total size and validate each log size
    const totalSize = logMessages.reduce((acc, log) => {
      const logSize = Buffer.byteLength(log.text, 'utf-8');
      if (logSize > MAX_LOG_SIZE) {
        throw new BadRequestException(
          `Log message exceeds the maximum size of 100 KB.`,
        );
      }
      return acc + logSize;
    }, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      throw new BadRequestException('Total log size exceeds the 5 MB limit');
    }

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
    userId: number,
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
        level: LogLevelEnum.info,
      },
    });

    // Count the warning logs in the period
    const warningCount = await this.logModel.count({
      where: {
        ...whereClause,
        level: LogLevelEnum.warning,
      },
    });

    // Count the error logs in the period
    const errorCount = await this.logModel.count({
      where: {
        ...whereClause,
        level: LogLevelEnum.error,
      },
    });

    // Count logs that contain localhost URLs in the period
    const messageWithUrlCount = await this.logModel.count({
      where: {
        ...whereClause,
        containsLocalhostUrls: true,
      },
    });

    this.eventEmitter.emit('user.events', {
      userId,
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          text: `user with id ${userId} queried logs report`,
        },
      ],
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

  @OnEvent('user.events')
  handleUserEvents({ userId, logs }: { userId: number; logs: SendLogRequest }) {
    this.storeLogs(userId, logs);
  }

  async findAll(
    userId: number,
    page: number,
    limit: number,
    sortBy: string,
    sortDirection: 'ASC' | 'DESC',
  ) {
    const offset = (page - 1) * limit;

    // Default sorting is by timestamp and level
    const validSortFields = ['timestamp', 'level', 'createdAt'];
    if (!validSortFields.includes(sortBy)) {
      throw new BadRequestException(
        `Invalid sortBy field. Must be one of: ${validSortFields.join(', ')}`,
      );
    }
    const { rows: logs, count: totalLogs } =
      await this.logModel.findAndCountAll({
        offset,
        limit,
        order: [[sortBy, sortDirection]],
      });
    const totalPages = Math.ceil(totalLogs / limit);

    this.eventEmitter.emit('user.events', {
      userId,
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          text: `user with id ${userId} queried all logs`,
        },
      ],
    });
    return {
      totalLogs,
      totalPages,
      currentPage: page,
      logs,
    };
  }
}
