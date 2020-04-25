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
import { checkModOrAdmin } from 'src/utils/check-role.utils';
import { EventToUser } from './eventToUser.entity';
import { EventToUserRepository } from './eventToUser.repository';
import { handleImage } from 'src/utils/file-upload.utils';

// const getParams = (param, user: User) => {
//   if (!checkModOrAdmin(user)) {
//     return { param, organiser: user };
//   }
//   return { param };
// };

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
    @InjectRepository(EventToUserRepository)
    private eventToUserRepository: EventToUserRepository,
  ) {}

  async getEvents(filterDTO: GetEventFilterDTO): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['organiser', 'attending'],
      join: {
        alias: 'event',
        leftJoinAndSelect: {
          reviews: 'event.reviews',
          author: 'reviews.author',
        },
      },
    });
  }

  async getEventBySlug(slug: string): Promise<Event> {
    const found = await this.eventRepository.findOne(
      { slug },
      {
        relations: ['organiser', 'attending'],
        join: {
          alias: 'event',
          leftJoinAndSelect: {
            reviews: 'event.reviews',
            author: 'reviews.author',
          },
        },
      },
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

  async deleteEvent(slug: string, user: User): Promise<void> {
    const options = checkModOrAdmin(user)
      ? { slug, organiser: user }
      : { slug };
    const event = await this.eventRepository.findOne(options);
    if (!event)
      throw new NotFoundException('No owned event found with this id');
    try {
      unlinkSync(`./uploads/events/${event.header}`);
      await event.remove();
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occured while deleting an event',
      );
    }
  }

  async getEventById(id) {
    return this.eventRepository.findOne(id, {
      relations: ['organiser', 'attending'],
      join: {
        alias: 'event',
        leftJoinAndSelect: {
          reviews: 'event.reviews',
          author: 'reviews.author',
        },
      },
    });
  }

  async updateEvent(
    id: number,
    updateEventDto: UpdateEventDTO,
    user: User,
  ): Promise<Event> {
    const options = checkModOrAdmin(user) ? { id, organiser: user } : { id };
    const result = await this.eventRepository.update(options, updateEventDto);
    if (result.affected === 0)
      throw new NotFoundException(`Event "${id}" is not found in the db`);

    return this.getEventById(id);
  }

  async attendEvent(eventId: number, user: User, vehicleId: number) {
    const attending = new EventToUser();
    attending.userId = user.id;
    attending.eventId = eventId;
    if (vehicleId) attending.vehicleId = vehicleId;
    await attending.save();
    return this.getEventById(eventId);
  }

  async leaveEvent(eventId: number, user: User) {
    const result = await this.eventToUserRepository.delete({ eventId, user });
    if (result.affected === 0)
      throw new NotFoundException('The user is not attending this event');
    else return this.getEventById(eventId);
  }

  async updateHeader(id: number, user: User, header) {
    const found = await this.getEventById(id);
    found.header = await handleImage(header.path, {
      width: 2000,
      isSquare: false,
      dest: `uploads/events/${found.slug}`,
      name: 'header',
      format: 'jpg',
    });
    await found.save();
    return found;
  }
}
