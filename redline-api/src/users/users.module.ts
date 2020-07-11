import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { FollowRepository } from './follow.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserRepository, FollowRepository]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
