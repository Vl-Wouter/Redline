import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Delete,
  Param,
} from '@nestjs/common';
import { CreateReviewDTO } from './dto/create-review.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Review } from './review.entity';

@Controller('reviews')
@UseGuards(AuthGuard())
@ApiTags('Reviews')
@ApiBearerAuth()
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ operationId: 'Create a review' })
  @ApiBody({ description: 'Review Data', type: CreateReviewDTO })
  @ApiCreatedResponse({
    description: 'Review has successfully been created',
    type: Review,
  })
  @ApiBadRequestResponse({ description: 'Review data is incorrect' })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to create a review',
  })
  createReview(
    @Body() createReviewDTO: CreateReviewDTO,
    @GetUser() user: User,
  ) {
    return this.reviewsService.createReview(createReviewDTO, user);
  }

  @Delete('/:id')
  @ApiOperation({ operationId: 'Delete a review' })
  @ApiNoContentResponse({ description: 'Review has successfully been deleted' })
  @ApiUnauthorizedResponse({
    description: 'User is not authorized to delete this review',
  })
  @ApiNotFoundResponse({ description: 'Cannot find review to delete' })
  deleteReview(@Param('id') id: number, @GetUser() user: User) {
    return this.reviewsService.deleteReview(id, user);
  }
}
