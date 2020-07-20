import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Album } from './album.entity';

@Entity()
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  url: string;

  @Column({ nullable: true })
  @ApiProperty()
  alt: string;

  @ManyToOne(
    type => Album,
    album => album.photos,
    { onDelete: 'CASCADE' },
  )
  album: Album;
}
