import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller()
@ApiTags('General')
export class AppController {
  @Get('img/:type/:folder/:file')
  getImage(@Param() path, @Res() res: Response) {
    const { type, folder, file } = path;
    res.sendFile(`/${type}/${folder}/${file}`, { root: 'uploads' });
  }
}
