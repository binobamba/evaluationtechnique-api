import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsDateString,
  IsOptional,
  IsPhoneNumber,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/user.entity';

export class LoginDto {
  @ApiProperty({ 
    example: 'jdupont ou jean.dupont@email.com', 
    description: 'Email ou nom d\'utilisateur' 
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty()
  password: string;
}