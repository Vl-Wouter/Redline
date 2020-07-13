import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { FollowRepository } from './follow.repository';
import { UserRole } from './user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(FollowRepository)
    private followRepository: FollowRepository,
  ) {}

  async getUser(param: object, fields?): Promise<User> {
    const found = await this.userRepository.findOneOrFail(param, {
      select: [
        'id',
        'username',
        'firstName',
        'lastName',
        'profileImg',
        'roles',
        ...(fields ?? []),
      ],
      relations: ['ownEvents', 'vehicles'],
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          followed: 'user.followed',
          followedUsers: 'followed.follows',
          following: 'user.follows',
          followingUsers: 'following.leads',
        },
      },
    });
    return found;
  }

  async getUserById(id: number, fields?): Promise<User> {
    return this.getUser({ id: id }, fields);
  }

  async getUserByName(name: string, fields?): Promise<User> {
    return this.getUser({ username: name }, fields);
  }

  async follow(id: number, user: User): Promise<User> {
    const follow = this.followRepository.create({
      leads: await this.getUserById(id),
      follows: user,
    });
    await follow.save();
    return this.getUserById(id);
  }

  async unfollow(id: number, user: User): Promise<User> {
    await this.followRepository.delete({
      leads: await this.getUserById(id),
      follows: user,
    });
    return this.getUserById(id);
  }

  // async update(id: number, update, user: User) {
  //   // if (id != user.id) {
  //   //   throw new NotFoundException('Cannot find this user');
  //   // }
  //   // let userToUpdate = await this.getUser({ id });
  //   // let values = update;
  //   // if (update.currentPassword) {
  //   //   userToUpdate = await this.getSecure(id, update);
  //   //   const { currentPassword, ...rest } = update;
  //   //   values = rest;
  //   // }
  //   // userToUpdate.save(values);
  //   // if (values.password) {
  //   //   userToUpdate.password = await this.userRepository.ha
  //   // }
  //   // if (values.roles) {

  //   // }
  //   // return userToUpdate;
  // }
  async updateAccount(id: number, update, user: User) {
    if (id != user.id) throw new NotFoundException('Cannot find user');
    const { currentPassword, ...values } = update;
    const userToUpdate = await this.getUser({ id }, ['password', 'salt']);
    const isAuthorized = await userToUpdate.validatePassword(currentPassword);
    if (!isAuthorized) throw new NotFoundException('Cannot find user');
    console.log(values);

    return this.userRepository.updateAccount(values, userToUpdate);
  }

  async updateProfile(id: number, update, user: User) {
    if (id != user.id) throw new NotFoundException('Cannot find user');
    const { role, ...values } = update;
    await this.userRepository.update(user.id, values);
    if (role) {
      user.roles = [role, UserRole.USER];
    }
    return this.userRepository.findOne(user.id);
  }

  // async getSecure(id, params) {
  //   const { currentPassword } = params;
  //   const user = await this.getUser({ id }, ['password', 'salt']);
  //   const isAuthorized = await user.validatePassword(currentPassword);
  //   if (!isAuthorized) {
  //     throw new NotFoundException('Cannot find this user');
  //   }
  //   return user;
  // }
}
