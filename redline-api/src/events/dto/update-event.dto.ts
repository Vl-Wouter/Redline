import {
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDTO {
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  title: string;
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  description: string;
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  categoryId: number;
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  @ApiPropertyOptional()
  startTime: string;
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  @ApiPropertyOptional()
  endTime: string;
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  address: string;
  @IsOptional()
  @IsLatitude()
  @ApiPropertyOptional()
  latitude: number;
  @IsOptional()
  @IsLongitude()
  @ApiPropertyOptional()
  longitude: number;
  @IsOptional()
  @ApiPropertyOptional()
  header: string;
}
