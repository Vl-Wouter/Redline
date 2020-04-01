import { BaseEntity, Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Entity()
export class Review extends BaseEntity {
  @Column()
  id: number;
  @Column()
  authorId: number;
  @Column()
  eventId: number;
  @Column()
  content: string;
  @Column()
  isRecommended: boolean;

  @ManyToOne(
    type => User,
    user => user.reviews,
  )
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToOne(
    type => Event,
    event => event.reviews,
  )
  @JoinColumn({ name: 'eventId' })
  event: Event;
}
