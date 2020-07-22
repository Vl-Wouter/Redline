import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserRepository } from './users/user.repository';
import { UsersSeeder } from './seeders/user.seeder';

seeder({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UserRepository]),
  ],
}).run([UsersSeeder]);
