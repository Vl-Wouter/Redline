import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import * as bcrypt from 'bcrypt';
import { Event } from 'src/events/event.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/category.entity';
import { Vehicle } from 'src/vehicles/vehicle.entity';
import { EventToUser } from 'src/events/eventToUser.entity';
import { Review } from 'src/reviews/review.entity';

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
  @Column()
  password: string;
  @Column()
  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
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
}
