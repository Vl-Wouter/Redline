import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from 'src/events/entities/event.entity';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  parentId: number;

  @ManyToOne(
    type => Category,
    parent => parent.childCategories,
  )
  @JoinColumn({ name: 'parentId' })
  parentCategory: Category;

  @OneToMany(
    type => Category,
    child => child.parentCategory,
  )
  childCategories: Category[];

  @OneToMany(
    type => Event,
    event => event.category,
    { eager: false },
  )
  events: Event[];
}
