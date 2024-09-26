import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { LogService } from './log.service';
import { SendLogRequest } from './dto/log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportingRequest, ReportingResponse } from './dto/reporting.dto';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async SendLogs(@Request() req, @Body() logs: SendLogRequest) {
    const userId = req.user.id;
    await this.logService.storeLogs(userId, logs);
    return { message: 'Logs stored successfully.' };
  }

  @Get('report')
  async generateReport(
    @Body() reportRequest: ReportingRequest,
  ): Promise<ReportingResponse> {
    const { startDate, endDate } = reportRequest;
    return this.logService.generateReport(startDate, endDate);
  }
}
