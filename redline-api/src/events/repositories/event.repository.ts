import { Repository, EntityRepository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { CreateEventDTO } from '../dto/create-event.dto';
import { GetEventFilterDTO } from '../dto/get-event-filters.dto';
import { User } from 'src/users/user.entity';
import { slugify } from 'src/utils/slugify.utils';
import { unlinkSync } from 'fs';
import { InternalServerErrorException } from '@nestjs/common';
import { handleImage } from 'src/utils/file-upload.utils';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  async getEvents(): Promise<Event[]> {
    const query = this.createQueryBuilder('event')
      .leftJoinAndSelect('event.organiser', 'organiser')
      .leftJoinAndSelect('event.attending', 'attendee')
      .innerJoinAndSelect('event.reviews', 'review')
      .innerJoinAndSelect('reviews.author', 'reviewAuthor');

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
      event.header = await handleImage(headerImage.path, {
        width: 2000,
        isSquare: false,
        dest: `uploads/events/${event.slug}`,
        name: 'header',
        format: 'jpg',
      });
      event.organiser = user;
      await event.save();
      return event;
    } catch (error) {
      unlinkSync(`./${headerImage.path}`);
      throw new InternalServerErrorException(error);
    }
  }
}
