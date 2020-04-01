import { IsObject, IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDTO {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name: string;
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  parentId: number;
}
