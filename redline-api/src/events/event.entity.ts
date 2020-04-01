import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/category.entity';
import { EventToUser } from './eventToUser.entity';
import { Review } from 'src/reviews/review.entity';

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  slug: string;

  @Column('varchar', { length: 500 })
  @ApiProperty()
  description: string;

  @Column()
  categoryId: number;
  @ManyToOne(
    type => Category,
    category => category.events,
    { eager: true, cascade: true },
  )
  @JoinColumn({ name: 'categoryId' })
  @ApiProperty()
  category: Promise<Category>;

  @Column()
  @ApiProperty()
  startTime: string;

  @Column()
  @ApiProperty()
  endTime: string;

  @Column()
  @ApiProperty()
  address: string;

  @Column({ default: 0 })
  latitude: number;

  @Column({ default: 0 })
  longitude: number;

  @ManyToOne(
    type => User,
    user => user.ownEvents,
    { eager: false, cascade: true },
  )
  @ApiProperty()
  organiser: User;

  @Column()
  @ApiProperty()
  header: string;

  @OneToMany(
    type => EventToUser,
    eventToUser => eventToUser.event,
    { cascade: true },
  )
  attending: EventToUser[];

  @OneToMany(
    type => Review,
    review => review.event,
  )
  reviews: Review[];

  /**
   * @todo Add pricing to event
   * @body Had an idea to add pricing to the event, it didn't work.
   * Pricing has to include multiple prices.
   */
}
