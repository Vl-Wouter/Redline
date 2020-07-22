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
import { Event } from 'src/events/entities/event.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/category.entity';
import { Vehicle } from 'src/vehicles/vehicle.entity';
import { EventToUser } from 'src/events/entities/eventToUser.entity';
import { Review } from 'src/reviews/review.entity';
import { Follow } from './follow.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Article } from 'src/articles/entities/article.entity';
import { Factory } from 'nestjs-seeder';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ select: false })
  @Factory(faker => faker.internet.email())
  @ApiProperty()
  email: string;

  @Column()
  @Factory(faker => faker.internet.userName())
  @ApiProperty()
  username: string;

  @Column({ select: false })
  @Factory('secret')
  password: string;

  @Column({ select: false })
  @Factory(null)
  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  @Column()
  @Factory(faker => faker.name.firstName())
  @ApiProperty()
  firstName: string;

  @Column()
  @Factory(faker => faker.name.lastName)
  @ApiProperty()
  lastName: string;

  @Column({ type: 'set', enum: UserRole, default: UserRole.USER })
  @Factory(UserRole.USER)
  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  roles: UserRole[];

  isAdmin() {
    return (
      this.roles.includes(UserRole.ADMIN) ||
      this.roles.includes(UserRole.MODERATOR)
    );
  }

  @Column({ default: null, nullable: true })
  @Factory(faker => faker.image.imageUrl)
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
    type => Article,
    article => article.author,
  )
  articles: Article[];

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
