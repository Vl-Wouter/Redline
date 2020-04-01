import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRepository } from './event.repository';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventRepository]),
    AuthModule,
    CategoriesModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
