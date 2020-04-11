import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiHideProperty,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ operationId: 'Sign up', description: 'Create a new user' })
  @ApiCreatedResponse({ description: 'User has been created' })
  signUp(@Body(ValidationPipe) createUserDTO: CreateUserDTO): Promise<void> {
    return this.authService.signUp(createUserDTO);
  }

  @Post('/signin')
  @ApiOperation({ operationId: 'Sign in' })
  @ApiOkResponse({ description: 'User successfully logged in' })
  signIn(
    @Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDTO);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  @ApiOperation({
    description: 'Test route to check authentication',
    operationId: 'Auth Test',
    deprecated: true,
  })
  @ApiBearerAuth()
  test(@GetUser() user: User) {
    console.log(user);
  }

  @Get('/:username')
  @ApiOperation({ operationId: 'Get user profile by name' })
  @ApiOkResponse({ description: 'User found', type: User })
  @ApiNotFoundResponse({ description: 'User not found' })
  getUserByName(@Param('username') username: string): Promise<User> {
    return this.authService.getUserByName(username);
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
}
