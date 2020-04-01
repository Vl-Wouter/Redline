import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDTO {
  @IsString()
  @ApiProperty()
  brand: string;
  @IsString()
  @ApiProperty()
  model: string;
  @IsOptional()
  @ApiPropertyOptional()
  photo: any;
}
