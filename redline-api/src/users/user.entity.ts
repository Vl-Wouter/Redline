import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import * as bcrypt from 'bcrypt';
import { Event } from 'src/events/event.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/category.entity';
import { Vehicle } from 'src/vehicles/vehicle.entity';
import { EventToUser } from 'src/events/eventToUser.entity';
import { Review } from 'src/reviews/review.entity';
import { Follow } from './follow.entity';
import { Album } from 'src/albums/entities/album.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column({ select: false })
  @ApiProperty()
  email: string;
  @Column()
  @ApiProperty()
  username: string;
  @Column({ select: false })
  password: string;
  @Column({ select: false })
  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    console.log(hash, this.password);
    return hash === this.password;
  }
  @Column()
  @ApiProperty()
  firstName: string;
  @Column()
  @ApiProperty()
  lastName: string;
  @Column({ type: 'set', enum: UserRole, default: UserRole.USER })
  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  roles: UserRole[];
  @Column({ default: null, nullable: true })
  @ApiProperty()
  profileImg: string;

  @Column({ default: null, nullable: true, select: false })
  @ApiProperty()
  resetToken: string;

  @Column({ type: 'timestamp', default: null, nullable: true, select: false })
  @ApiProperty()
  tokenExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    type => Event,
    event => event.organiser,
    { eager: true },
  )
  @ApiProperty({ type: Event })
  ownEvents: Event[];

  @OneToMany(
    type => Vehicle,
    vehicle => vehicle.owner,
    { eager: true, cascade: true },
  )
  vehicles: Vehicle[];

  @OneToMany(
    type => Album,
    album => album.photographer,
    { eager: true },
  )
  albums: Album[];

  @OneToMany(
    type => EventToUser,
    eventToUser => eventToUser.user,
    { cascade: true },
  )
  attendingEvents: EventToUser[];

  @OneToMany(
    type => Review,
    review => review.author,
  )
  reviews: Review[];

  @OneToMany(
    type => Follow,
    follow => follow.leads,
    { eager: true },
  )
  followed: User[];

  @OneToMany(
    type => Follow,
    follow => follow.follows,
    { eager: true },
  )
  follows: User[];
}
