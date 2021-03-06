import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDTO } from '../auth/dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../auth/dto/create-user.dto';
import { UserRole } from './user-role.enum';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { handleImage } from 'src/utils/file-upload.utils';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(createUserDTO: CreateUserDTO, profileImage): Promise<void> {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      role,
    } = createUserDTO;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    if (role && role !== UserRole.USER) {
      user.roles = [UserRole[role], UserRole.USER];
    } else {
      user.roles = [UserRole.USER];
    }
    if (profileImage) {
      user.profileImg = await handleImage(profileImage.path, {
        width: 256,
        isSquare: true,
        dest: `uploads/users/${user.username}`,
        name: 'avatar',
        format: 'jpg',
      });
    } else {
      user.profileImg = `users/default/user.png`;
    }
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        //duplicate value
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<JwtPayload> {
    const { username, password } = authCredentialsDTO;
    const user = await this.findOne(
      { username },
      {
        select: [
          'id',
          'username',
          'email',
          'password',
          'salt',
          'roles',
          'firstName',
          'lastName',
          'profileImg',
        ],
      },
    );

    if (user && (await user.validatePassword(password))) {
      return {
        id: user.id,
        username: user.username,
        roles: user.roles,
        fullName: `${user.firstName} ${user.lastName}`,
        profileImg: user.profileImg,
      };
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async updateAccount(values, user: User) {
    await this.update(user.id, values);
    if (values.password) {
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(values.password, user.salt);
      await user.save();
    }
    return this.findOne(user.id);
  }
}
