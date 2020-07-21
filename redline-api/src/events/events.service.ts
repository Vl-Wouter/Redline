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
import { User } from 'src/users/user.entity';
import { unlinkSync, unlink } from 'fs';
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
    const { withPast } = filterDTO;
    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create query
    let query = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organiser', 'organiser')
      .leftJoinAndSelect('event.attending', 'attending')
      .leftJoinAndSelect('event.reviews', 'reviews')
      .leftJoinAndSelect('reviews.author', 'reviewAuthor')
      .leftJoinAndSelect('event.albums', 'albums')
      .leftJoinAndSelect('albums.photos', 'photos');

    if (!withPast) {
      query.where('event.startTime >= :time', {
        time: today,
      });
    }

    query.orderBy('RAND()');

    return query.getMany();
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
      await unlink(`./uploads/${event.header}`, err => {
        if (err) {
          throw new InternalServerErrorException(
            'Failed to unlink the header image',
          );
        }
      });
      await this.eventRepository.delete(event.id);
    } catch (error) {
      throw new InternalServerErrorException(
        error.message ?? 'An error occured while deleting this event',
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
    slug: string,
    updateEventDto: UpdateEventDTO,
    user: User,
  ): Promise<Event> {
    const result = await this.eventRepository.update(
      { slug, organiser: user },
      updateEventDto,
    );

    if (result.affected === 0 || result.raw.affectedRows === 0)
      throw new NotFoundException(
        `Event "${slug.replace('-', ' ')}" not found`,
      );

    return this.getEventBySlug(slug);
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
    console.log('user leaving event');
    const result = await this.eventToUserRepository.delete({ eventId, user });
    if (result.affected === 0 || result.raw.rowsAffected === 0)
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
