import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsNumber()
  parentId: number;
}
