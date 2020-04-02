import {
  BaseEntity,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Event } from 'src/events/event.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column()
  @ApiProperty()
  authorId: number;
  @Column()
  @ApiProperty()
  eventId: number;
  @Column()
  @ApiProperty()
  content: string;
  @Column()
  @ApiProperty()
  isRecommended: boolean;

  @ManyToOne(
    type => User,
    user => user.reviews,
  )
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToOne(
    type => Event,
    event => event.reviews,
  )
  @JoinColumn({ name: 'eventId' })
  event: Event;
}
