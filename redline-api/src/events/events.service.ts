import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventRepository } from './event.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { CreateEventDTO } from './dto/create-event.dto';
import { UpdateEventDTO } from './dto/update-event.dto';
import { GetEventFilterDTO } from './dto/get-event-filters.dto';
import { User } from 'src/auth/user.entity';
import { unlinkSync } from 'fs';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
  ) {}

  async getEvents(filterDTO: GetEventFilterDTO): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async getEventBySlug(slug: string): Promise<Event> {
    const found = await this.eventRepository.findOne(
      { slug },
      { relations: ['organiser'] },
    );

    if (!found)
      throw new NotFoundException(`Event "${slug} not found in the db"`);

    return found;
  }

  async createEvent(
    createEventDTO: CreateEventDTO,
    user: User,
    headerImage,
  ): Promise<Event> {
    return this.eventRepository.createEvent(createEventDTO, user, headerImage);
  }

  async deleteEvent(slug: string): Promise<void> {
    const event = await this.getEventBySlug(slug);
    try {
      unlinkSync(`./uploads/events/${event.header}`);
      await event.remove();
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occured while deleting an event',
      );
    }
    // const result = await this.eventRepository.delete({ slug });
    // if (result.affected === 0)
    //   throw new NotFoundException(`Event "${slug}" is not found in the db`);
  }

  async updateEvent(
    slug: string,
    updateEventDto: UpdateEventDTO,
  ): Promise<Event> {
    console.log(updateEventDto);
    const result = await this.eventRepository.update({ slug }, updateEventDto);
    if (result.affected === 0)
      throw new NotFoundException(`Event "${slug}" is not found in the db`);
    return this.getEventBySlug(slug);
  }
}
