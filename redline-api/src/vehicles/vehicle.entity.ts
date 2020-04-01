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

@Entity()
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column()
  @ApiProperty()
  brand: string;
  @Column()
  @ApiProperty()
  model: string;
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
}
