import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDTO {
  @IsString()
  @ApiProperty()
  make: string;
  @IsString()
  @ApiProperty()
  model: string;
  @IsString()
  @ApiProperty()
  year: string;
  @IsOptional()
  @ApiPropertyOptional()
  photo: any;
}
