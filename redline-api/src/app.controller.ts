import {
  Controller,
  Get,
  Param,
  Res,
  Post,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { existsSync } from 'fs';

@Controller()
@ApiTags('General')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('img/*')
  @ApiOperation({ operationId: 'Get an image from the server' })
  @ApiOkResponse({ description: 'Image file' })
  getImage(@Param() path, @Res() res: Response) {
    const exists = existsSync(`./uploads/${path[0]}`);
    if (path[0] && exists) {
      return res.sendFile(path[0], { root: 'uploads' });
    } else {
      throw new NotFoundException(`Cannot find image: "${path[0]}"`);
    }
  }

  @Post('location')
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Convert address to coordinates' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Converted location to coordinates' })
  getLocation(@Body('address') address: string) {
    return this.appService.fetchLocation(address);
  }
}
