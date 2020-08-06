import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { CreateReportDTO } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';

@Controller('reports')
@ApiTags('Reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}
  // Add a report for a url
  @Post()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @ApiOperation({ operationId: 'Report a page' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateReportDTO })
  @ApiCreatedResponse({ description: 'Page is reported to admins' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized to report a page' })
  create(@Body() createReportDTO: CreateReportDTO, @GetUser() user: User) {
    return this.reportsService.create(createReportDTO, user);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Get all reports' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Reports', type: Report, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Not Authorized' })
  getAll(@GetUser() user: User) {
    console.log('TEST');
    return this.reportsService.getAll(user);
  }
}
