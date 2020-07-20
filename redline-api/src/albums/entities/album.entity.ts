import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Event } from 'src/events/event.entity';
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    type => Photo,
    photo => photo.album,
    { eager: true, cascade: true, onDelete: 'CASCADE' },
  )
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
    { cascade: true, nullable: true },
  )
  event: Event;
}
