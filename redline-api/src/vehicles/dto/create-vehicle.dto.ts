import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  make: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  model: string;

  @IsNotEmpty()
  @IsString()
  @IsNumberString()
  @ApiProperty()
  year: string;
}
