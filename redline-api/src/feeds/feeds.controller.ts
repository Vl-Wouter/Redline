import { Controller, Get, UseGuards } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('feeds')
export class FeedsController {
  constructor(private feedsService: FeedsService) {}

  @Get('')
  @UseGuards(AuthGuard())
  getFeed(@GetUser() user: User) {
    console.log(user);
    return this.feedsService.getFeed(user);
  }
}
