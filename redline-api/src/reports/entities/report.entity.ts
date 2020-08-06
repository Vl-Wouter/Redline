import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import { use } from 'passport';

@Entity()
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  url: string;

  @Column()
  type: string; // Event / Review / User / Gallery

  @Column()
  reason: string; // Possibly default options?

  @Column({ default: 'active' })
  flag: string;

  @CreateDateColumn()
  reportedAt: Date;

  @ManyToOne(
    type => User,
    user => user.reports,
  )
  reportedBy: User;
}
