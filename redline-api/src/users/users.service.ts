import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { FollowRepository } from './follow.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(FollowRepository)
    private followRepository: FollowRepository,
  ) {}

  async getUser(param: object): Promise<User> {
    const found = await this.userRepository.findOneOrFail(param, {
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

  async getUserById(id: number): Promise<User> {
    return this.getUser({ id: id });
  }

  async getUserByName(name: string): Promise<User> {
    return this.getUser({ username: name });
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
}
