import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDTO } from "./dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from "./dto/create-user.dto";
import { UserRole } from "./user-role.enum";
import { JwtPayload } from "./jwt-payload.interface";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(createUserDTO: CreateUserDTO): Promise<void> {
    const { username, password, email, firstName, lastName, roles, profileImg } = createUserDTO;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    if (roles !== UserRole.USER) {
      user.roles = [UserRole[roles], UserRole.USER];
    }
    if (profileImg) user.profileImg = profileImg;
    try {
      await user.save();
    } catch (error) { 
      if (error.code === '23505') { //duplicate value
        throw new ConflictException('Username already exists'); 
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDTO: AuthCredentialsDTO): Promise<JwtPayload> {
    const { username, password } = authCredentialsDTO;
    const user = await this.findOne({ username });

    if (user && await user.validatePassword(password)) {
      return { username: user.username, roles: user.roles, fullName: `${user.firstName} ${user.lastName}` };
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt); 
  }
}