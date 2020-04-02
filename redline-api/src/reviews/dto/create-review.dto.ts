import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDTO {
  @IsNumber()
  @ApiProperty()
  eventId: number;
  @IsString()
  @ApiProperty()
  content: string;
  @IsBoolean()
  @ApiProperty()
  isRecommended: boolean;
}
