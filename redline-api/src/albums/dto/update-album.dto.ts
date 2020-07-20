import { IsOptional, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlbumDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @ApiProperty()
  description: string;
}
