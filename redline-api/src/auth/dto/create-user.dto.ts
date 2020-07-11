import { UserRole } from '../../users/user-role.enum';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  MinLength,
  MaxLength,
  Matches,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @ApiProperty()
  username: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  @ApiProperty()
  password: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;
  @IsOptional()
  @IsIn([
    UserRole.ADMIN,
    UserRole.ORGANISER,
    UserRole.OWNER,
    UserRole.PHOTOGRAPHER,
    UserRole.USER,
  ])
  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  roles: UserRole;
  @IsOptional()
  @IsString()
  @ApiProperty()
  profileImg: string;
}
