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

export class CreateUserDto {
  @ApiProperty({ example: 'jean.dupont@email.com', description: 'Adresse email unique' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'jdupont', description: 'Nom d\'utilisateur unique' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'Dupont', description: 'Nom de famille' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'Jean', description: 'Prénom' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'password123', minLength: 6, description: 'Mot de passe de l\'utilisateur' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '1990-05-15', description: 'Date de naissance au format ISO YYYY-MM-DD' })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({ example: 'Abidjan', description: 'Ville' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Côte d\'Ivoire', description: 'Pays' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'FR', description: 'Code pays ISO2' })
  @IsString()
  @Length(2, 2)
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({ 
    example: 'https://example.com/avatar.jpg', 
    description: 'URL de l\'avatar', 
    required: false 
  })
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 'Acme Corp', description: 'Entreprise' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 'Développeur', description: 'Poste' })
  @IsString()
  @IsNotEmpty()
  jobPosition: string;

  @ApiProperty({ example: '+33123456789', description: 'Numéro de mobile' })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({ 
    enum: Role, 
    example: Role.USER, 
    description: 'Rôle de l\'utilisateur',
    default: Role.USER
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
