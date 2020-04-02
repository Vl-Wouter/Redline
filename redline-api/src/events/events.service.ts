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

const getParams = (slug, user: User) => {
  if (!checkModOrAdmin(user)) {
    return { slug, organiser: user };
  }
  return { slug };
};

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
    @InjectRepository(EventToUserRepository)
    private eventToUserRepository: EventToUserRepository,
  ) {}

  async getEvents(filterDTO: GetEventFilterDTO): Promise<Event[]> {
    return this.eventRepository.find({ relations: ['organiser', 'attending'] });
  }

  async getEventBySlug(slug: string): Promise<Event> {
    const found = await this.eventRepository.findOne(
      { slug },
      { relations: ['organiser', 'attending', 'reviews'] },
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
    const event = await this.eventRepository.findOne(getParams(slug, user));
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

  async updateEvent(
    slug: string,
    updateEventDto: UpdateEventDTO,
    user: User,
  ): Promise<Event> {
    const result = await this.eventRepository.update(
      getParams(slug, user),
      updateEventDto,
    );
    if (result.affected === 0)
      throw new NotFoundException(`Event "${slug}" is not found in the db`);
    return this.getEventBySlug(slug);
  }

  async attendEvent(eventId: number, user: User, vehicleId: number) {
    const attending = new EventToUser();
    attending.userId = user.id;
    attending.eventId = eventId;
    if (vehicleId) attending.vehicleId = vehicleId;
    await attending.save();

    return attending;
  }

  async leaveEvent(eventId: number, user: User) {
    const result = await this.eventToUserRepository.delete({ eventId, user });
    const attendees = await this.eventToUserRepository.find();
    console.log(attendees);
    if (result.affected === 0)
      throw new NotFoundException('The user is not attending this event');
  }
}
