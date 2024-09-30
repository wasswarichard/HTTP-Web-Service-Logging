import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LogService } from './log.service';
import { SendLogRequestDto } from './dto/log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportingRequest, ReportingResponse } from './dto/reporting.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleTypeEnum } from '../auth/role.constant';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Roles(RoleTypeEnum.ADMIN)
  @Post()
  async SendLogs(
    @Request() req,
    @Body(new ValidationPipe()) sendLogRequestDto: SendLogRequestDto,
  ) {
    const userId = req.user.id;
    const { logs } = sendLogRequestDto;
    await this.logService.storeLogs(userId, logs);
    return { message: 'Logs stored successfully.' };
  }

  @Roles(RoleTypeEnum.ADMIN)
  @Post('report')
  async generateReport(
    @Body(new ValidationPipe()) reportRequest: ReportingRequest,
  ): Promise<ReportingResponse> {
    const { startDate, endDate } = reportRequest;
    return this.logService.generateReport(startDate, endDate);
  }
}
