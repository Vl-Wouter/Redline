import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/user.repository';
import { User } from 'src/users/user.entity';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async seed() {
    const users = DataFactory.createForClass(User).generate(2);

    return this.userRepository.save(users);
  }

  async drop() {
    return this.userRepository.delete({});
  }
}
