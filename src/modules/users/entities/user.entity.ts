import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'ID unique de l\'utilisateur' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'jean.dupont@email.com', description: 'Adresse email unique' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'jdupont', description: 'Nom d\'utilisateur unique' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ example: 'Dupont', description: 'Nom de famille' })
  @Column()
  lastName: string;

  @ApiProperty({ example: 'Jean', description: 'Prénom' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'Mot de passe hashé' })
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({ example: '1990-05-15', description: 'Date de naissance' })
  @Column({ type: 'date' })
  birthDate: Date;

  @ApiProperty({ example: 'Paris', description: 'Ville' })
  @Column()
  city: string;

  @ApiProperty({ example: 'France', description: 'Pays' })
  @Column()
  country: string;

  @ApiProperty({ example: 'FR', description: 'Code pays ISO2' })
  @Column({ length: 2 })
  countryCode: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'URL de l\'avatar' })
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty({ example: 'Acme Corp', description: 'Entreprise' })
  @Column()
  company: string;

  @ApiProperty({ example: 'Développeur', description: 'Poste' })
  @Column()
  jobPosition: string;

  @ApiProperty({ example: '+33123456789', description: 'Numéro de mobile' })
  @Column()
  mobile: string;

  @ApiProperty({ 
    enum: Role,
    example: Role.USER, 
    description: 'Rôle de l\'utilisateur' 
  })
  @Column({ 
    type: 'enum', 
    enum: Role, 
    default: Role.USER
  })
  role: Role;

  @ApiProperty({ description: 'Date de création du compte' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière mise à jour' })
  @UpdateDateColumn()
  updatedAt: Date;
}