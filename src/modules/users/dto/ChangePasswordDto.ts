import {
  IsString,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123', description: 'Ancien mot de passe' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'newPassword123', description: 'Nouveau mot de passe' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}