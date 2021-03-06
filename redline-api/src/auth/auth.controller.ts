import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto';
import { CreateUserDTO } from './dto/create-user.dto';
import {
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
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

  @Post('/forgot')
  @ApiOperation({ operationId: 'Request password reset' })
  @ApiOkResponse({ description: 'Password reset sent' })
  @ApiNotFoundResponse({ description: 'User not found' })
  sendResetLink(@Req() request, @Body() details) {
    return this.authService.sendResetLink(request, details);
  }

  @Get('/reset/:token')
  @ApiOperation({ operationId: 'Get user from reset token' })
  @ApiOkResponse({ description: 'Token is valid, user returned' })
  @ApiNotFoundResponse({ description: 'Token is invalid' })
  getUserFromToken(@Param('token') token: string) {
    return this.authService.getUserFromToken(token);
  }

  @Post('/reset/:token')
  @ApiOperation({ operationId: 'Reset user password' })
  @ApiOkResponse({ description: 'Password has been updated' })
  @ApiNotFoundResponse({
    description: 'Cannot find a user to update / Invalid token',
  })
  resetPassword(@Param('token') token: string, @Body() values) {
    return this.authService.resetPassword(token, values);
  }

  // MOVE ALL BELOW TO NEW USERS API
  // @Patch('/:username')
  // @UseGuards(AuthGuard())
  // updateUserByName(
  //   @Param('username') username: string,
  //   @Body() userData,
  //   @GetUser() user: User,
  // ) {
  //   return this.authService.updateUserByName(username, userData, user);
  // }

  // @Get('/:username/avatar')
  // getUserAvatar(@Param('username') username: string, @Res() res) {
  //   res.sendFile(`/users/${username}/avatar.jpg`, { root: 'uploads' });
  // }

  // @Post('/:username/avatar')
  // @UseGuards(AuthGuard())
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     storage: diskStorage({
  //       destination: './uploads/tmp',
  //       filename: editFileName,
  //     }),
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  // updateUserAvatar(
  //   @Param('username') username: string,
  //   @UploadedFile() avatarFile,
  //   @GetUser() user: User,
  // ) {
  //   return this.authService.updateUserAvatar(username, avatarFile, user);
  // }

  // @Get('/:username/all')
  // @UseGuards(AuthGuard())
  // @ApiOperation({ operationId: 'Get user settings' })
  // @ApiBearerAuth()
  // @ApiOkResponse({ description: 'Found user information' })
  // @ApiUnauthorizedResponse({ description: 'Cannot fetch user details' })
  // @ApiNotFoundResponse({ description: 'Cannot find user' })
  // getAllUserDetails(
  //   @Param('username') username: string,
  //   @GetUser() user: User,
  // ) {
  //   return this.authService.getAllUserDetails(username, user);
  // }
}
