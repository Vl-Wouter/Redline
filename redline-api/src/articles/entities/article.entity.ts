import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Event } from 'src/events/event.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  slug: string;

  @Column({ type: 'text' })
  @ApiProperty()
  content: string;

  @Column()
  @ApiProperty()
  header: string;

  @Column()
  @ApiProperty()
  eventId: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @ManyToOne(
    type => User,
    user => user.articles,
  )
  @ApiProperty()
  author: User;

  @ManyToOne(
    type => Event,
    event => event.articles,
  )
  @JoinColumn({ name: 'eventId' })
  @ApiProperty()
  event: Event;
}
