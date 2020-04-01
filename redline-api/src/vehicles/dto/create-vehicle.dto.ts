import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateVehicleDTO {
  @IsString()
  brand: string;
  @IsString()
  model: string;
  @IsOptional()
  photo: any;
}
