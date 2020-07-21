import {
  IsOptional,
  IsDateString,
  IsNotEmpty,
  IsBoolean,
  IsBooleanString,
} from 'class-validator';

export class GetEventFilterDTO {
  // @IsOptional()
  // @IsNotEmpty()
  // search: string;
  // @IsOptional()
  // @IsNotEmpty()
  // category: string;
  // @IsOptional()
  // @IsNotEmpty()
  // @IsDateString()
  // startTime: string;
  // @IsOptional()
  // @IsNotEmpty()
  // @IsDateString()
  // endTime: string;
  // @IsOptional()
  // @IsNotEmpty()
  // address: string;
  @IsOptional()
  @IsNotEmpty()
  @IsBooleanString()
  withPast: boolean;
}
