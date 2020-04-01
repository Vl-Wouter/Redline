import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDTO {
  @IsString()
  // @MinLength(4)
  // @MaxLength(30)
  @ApiProperty()
  username: string;
  @IsString()
  // @MinLength(8)
  // @MaxLength(30)
  // @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password is too weak' })
  @ApiProperty()
  password: string;
}
