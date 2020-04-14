import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDTO } from './dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserRole } from './user-role.enum';
import { JwtPayload } from './jwt-payload.interface';
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
      roles,
    } = createUserDTO;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    if (roles && roles !== UserRole.USER) {
      user.roles = [UserRole[roles], UserRole.USER];
    } else {
      user.roles = [UserRole.USER];
    }
    if (profileImage) {
      console.log(profileImage);
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
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return {
        id: user.id,
        username: user.username,
        roles: user.roles,
        fullName: `${user.firstName} ${user.lastName}`,
      };
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
