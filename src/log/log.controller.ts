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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleTypeEnum } from '../auth/role.constant';

@Controller('log')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Roles(RoleTypeEnum.USER)
  @Post()
  async SendLogs(@Request() req, @Body() logs: SendLogRequest) {
    const userId = req.user.id;
    await this.logService.storeLogs(userId, logs);
    return { message: 'Logs stored successfully.' };
  }

  @Roles(RoleTypeEnum.USER)
  @Post('report')
  async generateReport(
    @Request() req,
    @Body() reportRequest: ReportingRequest,
  ): Promise<ReportingResponse> {
    console.log(req.user);
    const { startDate, endDate } = reportRequest;
    return this.logService.generateReport(startDate, endDate);
  }
}
