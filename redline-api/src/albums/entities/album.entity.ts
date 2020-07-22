import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Event } from 'src/events/entities/event.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Photo } from './photo.entity';

@Entity()
export class Album extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  slug: string;

  @Column({ length: 500 })
  @ApiProperty()
  description: string;

  @Column({ nullable: true })
  @ApiProperty()
  eventId: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @OneToMany(
    type => Photo,
    photo => photo.album,
    { eager: true, cascade: true, onDelete: 'CASCADE' },
  )
  @ApiProperty()
  photos: Photo[];

  @ManyToOne(
    type => User,
    user => user.albums,
    { cascade: true },
  )
  photographer: User;

  @ManyToOne(
    type => Event,
    event => event.albums,
    { cascade: true },
  )
  @JoinColumn({ name: 'eventId' })
  event: Event;
}
