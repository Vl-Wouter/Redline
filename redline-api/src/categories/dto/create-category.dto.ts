import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  parentId: number;
}
