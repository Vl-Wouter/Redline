import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/category.entity';
import { EventToUser } from './eventToUser.entity';
import { Review } from 'src/reviews/review.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Article } from 'src/articles/entities/article.entity';

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

  @Column({ default: 0, type: 'float' })
  latitude: number;

  @Column({ default: 0, type: 'float' })
  longitude: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    type => User,
    user => user.ownEvents,
    { eager: false, cascade: true, onDelete: 'CASCADE' },
  )
  @ApiProperty()
  organiser: User;

  @Column()
  @ApiProperty()
  header: string;

  @OneToMany(
    type => EventToUser,
    eventToUser => eventToUser.event,
    { cascade: true, onDelete: 'CASCADE' },
  )
  attending: EventToUser[];

  @OneToMany(
    type => Review,
    review => review.event,
    { onDelete: 'CASCADE' },
  )
  reviews: Review[];

  @OneToMany(
    type => Album,
    album => album.event,
    { eager: true },
  )
  albums: Album[];

  @OneToMany(
    type => Article,
    article => article.event,
  )
  articles: Article[];

  /**
   * @todo Add pricing to event
   * @body Had an idea to add pricing to the event, it didn't work.
   * Pricing has to include multiple prices.
   */
}
