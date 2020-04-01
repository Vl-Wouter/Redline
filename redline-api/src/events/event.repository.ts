import { Repository, EntityRepository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDTO } from './dto/create-event.dto';
import { GetEventFilterDTO } from './dto/get-event-filters.dto';
import { start } from 'repl';
import { User } from 'src/auth/user.entity';
import { slugify } from 'src/utils/slugify.utils';
import { unlinkSync } from 'fs';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  async getEvents(filterDTO: GetEventFilterDTO): Promise<Event[]> {
    const { search, category, startTime, endTime, address } = filterDTO;
    const query = this.createQueryBuilder('event')
      .leftJoinAndSelect('event.organiser', 'organiser')
      .leftJoinAndSelect('event.attending', 'attendee');

    if (search)
      query.andWhere(
        '(event.title LIKE :search or event.description LIKE :search)',
        { search: `%${search}%` },
      );

    if (category)
      query.andWhere('event.category.name = :category', { category });

    if (startTime)
      query.andWhere(
        'event.startTime > :startTime OR event.endTime > :startTime',
        { startTime },
      );

    if (endTime)
      query.andWhere('event.startTime < :endTime OR event.endTime < :endTime', {
        endTime,
      });

    if (address) {
    }

    const events = await query.getMany();
    return events;
  }

  async createEvent(
    createEventDTO: CreateEventDTO,
    user: User,
    headerImage,
  ): Promise<any> {
    try {
      const event = await Event.create(createEventDTO);
      event.slug = slugify(event.title);
      event.header = headerImage.filename;
      event.organiser = user;
      await event.save();
      return event;
    } catch (error) {
      unlinkSync(`./${headerImage.path}`);
      throw new InternalServerErrorException(error);
    }
  }
}
