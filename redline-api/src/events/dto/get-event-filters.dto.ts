import { IsOptional, IsNotEmpty, IsBooleanString } from 'class-validator';

export class GetEventFilterDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsBooleanString()
  withPast: boolean;
}
