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
import { handleImage } from 'src/utils/file-upload.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDTO: CreateUserDTO, profileImage): Promise<void> {
    return this.userRepository.signUp(createUserDTO, profileImage);
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

  async updateUserByName(username: string, userData, user: User) {
    if (username !== user.username)
      throw new UnauthorizedException('You cannot update this profile');
    await this.userRepository.update({ username }, userData);
    return this.getAllUserDetails(username, user);
  }

  async updateUserAvatar(username: string, image, user) {
    console.log(username, image);
    if (username !== user.username)
      throw new UnauthorizedException('You cannot update this profile image');
    const profileImg = await handleImage(image.path, {
      width: 256,
      isSquare: true,
      dest: `uploads/users/${username}`,
      name: 'avatar',
      format: 'jpg',
    });
    console.log(profileImg);
    await this.userRepository.update({ username }, { profileImg });
    return this.getAllUserDetails(username, user);
  }

  async checkExisting(criteria) {
    const { field, value } = criteria;
    const found = await this.userRepository.findOne({ [field]: value });
    if (!found) return false;
    return true;
  }

  async getUserByName(username: string) {
    const found = await this.userRepository.findOne(
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
    if (!found)
      throw new NotFoundException(
        `Cannot find a user with the username ${username}`,
      );
    return found;
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
