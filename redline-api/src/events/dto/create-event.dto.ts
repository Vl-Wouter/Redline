import {
  IsNotEmpty,
  IsDateString,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDTO {
  @IsNotEmpty()
  @ApiProperty()
  title: string;
  @IsNotEmpty()
  @ApiProperty()
  description: string;
  @IsNotEmpty()
  @ApiProperty()
  categoryId: number;
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  startTime: string;
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  endTime: string;
  @IsNotEmpty()
  @ApiProperty()
  address: string;
  @IsLatitude()
  @ApiProperty()
  latitude: number;
  @IsLongitude()
  @ApiProperty()
  longitude: number;
  @ApiProperty()
  prices: Object[];
  @ApiProperty({ type: 'string', format: 'binary' })
  header: any;
}
