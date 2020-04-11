import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';

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

  async getUserByName(username: string) {
    return this.userRepository.findOne(
      { username },
      {
        select: [
          'id',
          'firstName',
          'lastName',
          'username',
          'roles',
          'profileImg',
        ],
        relations: ['attendingEvents', 'ownEvents', 'vehicles'],
        join: {
          alias: 'user',
          leftJoinAndSelect: {
            attendingEvents: 'user.attendingEvents',
            eventData: 'attendingEvents.event',
            eventCategory: 'eventData.category',
          },
        },
      },
    );
  }

  async getAllUserDetails(username: string, user: User) {
    if (username !== user.username)
      throw new NotFoundException(`Cannot find user details`);
    return this.userRepository
      .createQueryBuilder('u')
      .where('u.username = :username', { username: username })
      .addSelect('u.email')
      .leftJoinAndSelect('u.ownEvents', 'events')
      .leftJoinAndSelect('events.category', 'eventCat')
      .leftJoinAndSelect('u.vehicles', 'v')
      .getOne();
  }
}
