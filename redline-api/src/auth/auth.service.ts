import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDTO: CreateUserDTO): Promise<void> {
    return this.userRepository.signUp(createUserDTO);
  }

  async signIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const result = await this.userRepository.validateUserPassword(
      authCredentialsDTO,
    );
    if (!result) throw new UnauthorizedException('Invalid credentials');

    const { id, username, roles, fullName } = result;

    const payload: JwtPayload = { id, username, roles, fullName };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
