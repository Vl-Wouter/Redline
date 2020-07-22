import { Repository, EntityRepository } from 'typeorm';
import { EventToUser } from '../entities/eventToUser.entity';

@EntityRepository(EventToUser)
export class EventToUserRepository extends Repository<EventToUser> {}
