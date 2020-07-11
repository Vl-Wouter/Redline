import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { AuthModule } from 'src/auth/auth.module';
import { EventsModule } from 'src/events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRepository } from 'src/events/event.repository';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([EventRepository])],
  controllers: [FeedsController],
  providers: [FeedsService],
})
export class FeedsModule {}
