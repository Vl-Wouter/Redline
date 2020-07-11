import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from 'src/events/event.repository';
import { User } from 'src/users/user.entity';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
  ) {}

  async getFeed(user: User) {
    const events = await this.eventRepository.find();
    console.log(events);
    return events;
  }
}
