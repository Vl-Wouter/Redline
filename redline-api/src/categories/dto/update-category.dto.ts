import { IsObject, IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDTO {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsObject()
  parentId: number;
}
