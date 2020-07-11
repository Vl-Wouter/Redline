import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { EventToUser } from 'src/events/eventToUser.entity';

@Entity()
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column()
  @ApiProperty()
  make: string;
  @Column()
  @ApiProperty()
  model: string;
  @Column()
  @ApiProperty()
  year: string;
  @Column()
  @ApiProperty()
  photo: string;
  @Column()
  @ApiProperty()
  ownerId: number;
  @ManyToOne(
    type => User,
    user => user.vehicles,
  )
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(
    type => EventToUser,
    eventToUser => eventToUser.vehicle,
    { cascade: true },
  )
  events: EventToUser[];
}
