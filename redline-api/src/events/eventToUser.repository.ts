import { Repository, EntityRepository } from 'typeorm';
import { EventToUser } from './eventToUser.entity';

@EntityRepository(EventToUser)
export class EventToUserRepository extends Repository<EventToUser> {}
