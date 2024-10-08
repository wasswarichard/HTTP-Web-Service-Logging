import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  ValidationPipe,
  Get,
  Query,
} from '@nestjs/common';
import { LogService } from './log.service';
import { SendLogRequestDto } from './dto/log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportingRequest, ReportingResponse } from './dto/reporting.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleTypeEnum } from '../auth/role.constant';
import { Log } from './models/log.model';

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
  @Get('report')
  async generateReport(
    @Body(new ValidationPipe()) reportRequest: ReportingRequest,
    @Request() req,
  ): Promise<ReportingResponse> {
    const { startDate, endDate } = reportRequest;
    return this.logService.generateReport(req.user.id, startDate, endDate);
  }

  @Roles(RoleTypeEnum.ADMIN)
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'timestamp',
    @Query('sortDirection') sortDirection: 'ASC' | 'DESC' = 'DESC',
    @Request() req,
  ): Promise<{
    totalLogs: number;
    totalPages: number;
    currentPage: number;
    logs: Log[];
  }> {
    return this.logService.findAll(
      req.user.id,
      page,
      limit,
      sortBy,
      sortDirection,
    );
  }
}
