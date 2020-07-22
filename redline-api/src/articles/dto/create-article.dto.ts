import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumberString,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  @IsPositive()
  @ApiProperty()
  eventId?: number;
}
