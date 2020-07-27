import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsString,
  IsNumber,
  IsNumberString,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDTO {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(500)
  description: string;

  @IsOptional()
  @ApiProperty()
  @IsNumberString()
  eventId?: number;
}
