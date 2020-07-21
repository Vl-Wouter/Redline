import {
  Controller,
  Get,
  Param,
  Res,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
@ApiTags('General')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('img/*')
  @ApiOperation({ operationId: 'Get an image from the server' })
  @ApiOkResponse({ description: 'Image file' })
  getImage(@Param() path, @Res() res: Response) {
    res.sendFile(path[0], { root: 'uploads' });
  }

  @Post('location')
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Convert address to coordinates' })
  @ApiOkResponse({ description: 'Converted location to coordinates' })
  getLocation(@Body('address') address: String) {
    return this.appService.fetchLocation(address);
  }
}
