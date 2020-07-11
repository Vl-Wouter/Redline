import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:search')
  @ApiOperation({ operationId: 'Get user by ID or username' })
  @ApiOkResponse({ description: 'User found', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  getUser(@Param('search') search: number | string): Promise<User> {
    if (typeof search === 'string') {
      return this.usersService.getUserByName(search);
    } else {
      return this.usersService.getUserById(search);
    }
  }

  @Post('/:id/follow')
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Follow a user' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User has been followed', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  followUser(@Param('id') followId: number, @GetUser() user: User) {
    return this.usersService.follow(followId, user);
  }

  @Post('/:id/unfollow')
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Unfollow a user' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User has been unfollowed', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  unfollowUser(@Param('id') followId: number, @GetUser() user: User) {
    return this.usersService.unfollow(followId, user);
  }
}
