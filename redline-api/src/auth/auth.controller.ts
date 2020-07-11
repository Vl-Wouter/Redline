import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUser } from './get-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UseInterceptors(
    FileInterceptor('profileImg', {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiOperation({ operationId: 'Sign up', description: 'Create a new user' })
  @ApiCreatedResponse({ description: 'User has been created' })
  signUp(
    @Body(ValidationPipe) createUserDTO: CreateUserDTO,
    @UploadedFile() profileImage,
  ): Promise<void> {
    return this.authService.signUp(createUserDTO, profileImage);
  }

  @Post('/signin')
  @ApiOperation({ operationId: 'Sign in' })
  @ApiOkResponse({ description: 'User successfully logged in' })
  signIn(
    @Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDTO);
  }

  @Post('/check')
  checkExisting(@Body() criteria) {
    return this.authService.checkExisting(criteria);
  }

  // MOVE ALL BELOW TO NEW USERS API

  @Get('/:username')
  @ApiOperation({ operationId: 'Get user profile by name' })
  @ApiOkResponse({ description: 'User found', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  getUserByName(@Param('username') username: string): Promise<User> {
    return this.authService.getUserByName(username);
  }

  @Patch('/:username')
  @UseGuards(AuthGuard())
  updateUserByName(
    @Param('username') username: string,
    @Body() userData,
    @GetUser() user: User,
  ) {
    return this.authService.updateUserByName(username, userData, user);
  }

  @Get('/:username/avatar')
  getUserAvatar(@Param('username') username: string, @Res() res) {
    res.sendFile(`/users/${username}/avatar.jpg`, { root: 'uploads' });
  }

  @Post('/:username/avatar')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  updateUserAvatar(
    @Param('username') username: string,
    @UploadedFile() avatarFile,
    @GetUser() user: User,
  ) {
    return this.authService.updateUserAvatar(username, avatarFile, user);
  }

  @Get('/:username/all')
  @UseGuards(AuthGuard())
  @ApiOperation({ operationId: 'Get user settings' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Found user information' })
  @ApiUnauthorizedResponse({ description: 'Cannot fetch user details' })
  @ApiNotFoundResponse({ description: 'Cannot find user' })
  getAllUserDetails(
    @Param('username') username: string,
    @GetUser() user: User,
  ) {
    return this.authService.getAllUserDetails(username, user);
  }

  @Post(':id/follow')
  @UseGuards(AuthGuard())
  followUser(@Param('id') followId: number, @GetUser() user: User) {
    return this.authService.followUser(followId, user);
  }

  @Post('/:id/unfollow')
  @UseGuards(AuthGuard())
  unfollowUser(@Param('id') followId: number, @GetUser() user: User) {
    return this.authService.unfollowUser(followId, user);
  }
}
