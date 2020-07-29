import { BaseEntity, PrimaryGeneratedColumn, ManyToOne, Entity } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => User,
    user => user.follows,
  )
  follows: User;

  @ManyToOne(
    type => User,
    user => user.followed,
  )
  leads: User;
}
