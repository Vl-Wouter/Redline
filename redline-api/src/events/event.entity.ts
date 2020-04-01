import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/category.entity';

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
    user => user.events,
    { eager: false, cascade: true },
  )
  @ApiProperty()
  organiser: User;

  @Column()
  @ApiProperty()
  header: string;
}
