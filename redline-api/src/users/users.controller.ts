import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
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
  getUser(
    @Param('search') search: number | string,
    @Query('add') fields,
  ): Promise<User> {
    if (fields) {
      fields = fields.split(',');
    }
    if (typeof search === 'string') {
      return this.usersService.getUserByName(search, fields);
    } else {
      return this.usersService.getUserById(search, fields);
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

  @Patch('/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Update a user object' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Updated user', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  updateUser(
    @Param('id') id: number,
    @Body() update,
    @GetUser() user: User,
    @Query('type') type: string,
  ) {
    if (type === 'account') {
      return this.usersService.updateAccount(id, update, user);
    }
    return this.usersService.updateProfile(id, update, user);
  }
}
