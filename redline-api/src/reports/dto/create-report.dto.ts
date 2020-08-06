import { IsNotEmpty, IsString, IsUrl, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  type: string;

  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  reason: string;
}
