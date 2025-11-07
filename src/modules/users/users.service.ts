import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { User, Role } from './entities/user.entity';
import type { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

export interface BatchImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

interface ImportUserData {
  firstName: string;
  lastName: string;
  birthDate: string | Date;
  city: string;
  country: string;
  countryCode: string;
  avatar: string;
  company: string;
  jobPosition: string;
  mobile: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async generateUsers(count: number, res: Response): Promise<void> {
    if (!count || count < 1 || count > 1000) {
      throw new BadRequestException('Le paramètre count doit être entre 1 et 1000');
    }

    const users = Array.from({ length: count }, () => this.createRandomUser());

    // Configurer la réponse pour le téléchargement
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="users-${count}-${Date.now()}.json"`);
    
    res.send(users);
  }

  private createRandomUser(): ImportUserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username({ firstName, lastName });
    const email = faker.internet.email({ firstName, lastName });
    const password = faker.internet.password({ 
      length: faker.number.int({ min: 6, max: 10 }) 
    });
    const role = faker.helpers.arrayElement([Role.ADMIN, Role.USER]);

    return {
      firstName,
      lastName,
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      city: faker.location.city(),
      country: faker.location.country(),
      countryCode: faker.location.countryCode('alpha-2'),
      avatar: faker.image.avatar(),
      company: faker.company.name(),
      jobPosition: faker.person.jobTitle(),
      mobile: faker.phone.number(),
      username,
      email,
      password,
      role,
    };
  }

  async importUsers(file: Express.Multer.File): Promise<BatchImportResult> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    if (file.mimetype !== 'application/json') {
      throw new BadRequestException('Le fichier doit être au format JSON');
    }

    let users: ImportUserData[];
    try {
      const fileContent = file.buffer.toString('utf-8');
      users = JSON.parse(fileContent);
    } catch (error) {
      throw new BadRequestException('Fichier JSON invalide');
    }

    if (!Array.isArray(users)) {
      throw new BadRequestException('Le fichier doit contenir un tableau d\'utilisateurs');
    }

    const result: BatchImportResult = {
      total: users.length,
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const [index, userData] of users.entries()) {
      try {
        await this.importSingleUser(userData);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push(`Ligne ${index + 1}: ${error.message}`);
      }
    }

    return result;
  }

  private async importSingleUser(userData: ImportUserData): Promise<User> {

    const requiredFields = ['email', 'username', 'password', 'firstName', 'lastName'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        throw new BadRequestException(`Champ ${field} manquant`);
      }
    }

    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: userData.email },
        { username: userData.username }
      ]
    });

    if (existingUser) {
      throw new ConflictException('Email ou username déjà existant');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    let birthDate: Date | undefined = undefined;

    if (userData.birthDate) {
      const parsedDate = new Date(userData.birthDate);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Format de date invalide');
      }
      birthDate = parsedDate;
    }


    const user = this.usersRepository.create({
      email: userData.email.toLowerCase(),
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: hashedPassword,
      birthDate,
      city: userData.city,
      country: userData.country,
      countryCode: userData.countryCode,
      avatar: userData.avatar,
      company: userData.company,
      jobPosition: userData.jobPosition,
      mobile: userData.mobile,
      role: userData.role || Role.USER,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { email: email.toLowerCase() },
      select: ['id', 'email', 'username', 'firstName', 'lastName', 'birthDate', 'city', 'country', 'countryCode', 'avatar', 'company', 'jobPosition', 'mobile', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }


  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { username },
      select: ['id', 'email', 'username', 'firstName', 'lastName', 'birthDate', 'city', 'country', 'countryCode', 'avatar', 'company', 'jobPosition', 'mobile', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async findProfile(username: string, currentUser: any): Promise<User> {
    const requestedUser = await this.findByUsername(username);


    if (currentUser.role !== Role.ADMIN && currentUser.username !== username) {
      throw new ForbiddenException('Vous n\'avez pas la permission de consulter ce profil');
    }

    return requestedUser;
  }

  async validateUser(identifier: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: [
        { email: identifier.toLowerCase() },
        { username: identifier }
      ]
    });

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }


  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'username', 'firstName', 'lastName', 'birthDate', 'city', 'country', 'avatar', 'company', 'jobPosition', 'mobile', 'role', 'createdAt', 'updatedAt']
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      select: ['id', 'email', 'username', 'firstName', 'lastName', 'birthDate', 'city', 'country', 'avatar', 'company', 'jobPosition', 'mobile', 'role', 'createdAt', 'updatedAt']
    });
    
    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    }
    
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
      const existingUser = await this.usersRepository.findOne({
        where: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });

      if (existingUser) {
        throw new ConflictException('Email ou username déjà utilisé');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser: User = await this.usersRepository.save(user); 

      return savedUser;
    }

}