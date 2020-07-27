import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';

@Controller('reports')
@ApiTags('Reports')
export class ReportsController {
  // Add a report for a url
  @Post()
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Report a page' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Page is reported to admins' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized to report a page' })
  create(@Body('url') url: string, @GetUser() user: User) {}
  // Remove a reported url

  @Delete('/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Remove a report' })
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Report is removed' })
  @ApiUnauthorizedResponse({ description: 'Not authorized to remove a report' })
  delete(@Param('id') id: number, @GetUser() user: User) {}
}
