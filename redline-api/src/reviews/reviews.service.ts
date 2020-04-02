import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewRepository } from './review.repository';
import { CreateReviewDTO } from './dto/create-review.dto';
import { User } from 'src/auth/user.entity';
import { Review } from './review.entity';
import { checkModOrAdmin } from 'src/utils/check-role.utils';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,
  ) {}

  checkUserPrivileges(id: number, user: User) {
    if (!checkModOrAdmin(user)) {
      return { id, author: user };
    }
    return { id };
  }

  async createReview(createReviewDTO: CreateReviewDTO, user: User) {
    const review = Review.create(createReviewDTO);
    review.author = user;
    await review.save();

    return review;
  }

  async deleteReview(id: number, user: User) {
    const options = this.checkUserPrivileges(id, user);
    const result = await this.reviewRepository.delete(options);
    if (result.affected === 0)
      throw new NotFoundException(`Cannot delete this review`);
  }
}
