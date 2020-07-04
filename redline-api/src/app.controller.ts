import { Controller, Get, Param, Res, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
@ApiTags('General')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('img/:type/:folder/:file')
  getImage(@Param() path, @Res() res: Response) {
    const { type, folder, file } = path;
    res.sendFile(`/${type}/${folder}/${file}`, { root: 'uploads' });
  }

  @Post('location')
  getLocation(@Body('address') address: String) {
    return this.appService.fetchLocation(address);
  }
}
