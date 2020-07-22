import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from 'src/users/user.entity';
import { Vehicle } from 'src/vehicles/vehicle.entity';

@Entity()
export class EventToUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  eventId: number;
  @Column()
  userId: number;
  @Column({ nullable: true })
  vehicleId: number;

  @ManyToOne(
    type => Event,
    event => event.attending,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ManyToOne(
    type => User,
    user => user.attendingEvents,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(
    type => Vehicle,
    vehicle => vehicle.events,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;
}
