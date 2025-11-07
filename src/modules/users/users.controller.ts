import { 
  Controller, Get, Post, Param, UseGuards, Query, UploadedFile,
  UseInterceptors, Req, Res, HttpStatus, UnauthorizedException, NotFoundException 
} from '@nestjs/common';

import { 
  ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiQuery,ApiBody 
} from '@nestjs/swagger';

import { UsersService, BatchImportResult } from './users.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { Public } from '../../common/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { User } from './entities/user.entity';
import { FileUploadDto } from './dto/FileUploadDto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get('generate')
  @ApiOperation({ summary: 'Générer un fichier JSON d\'utilisateurs aléatoires' })
  @ApiQuery({ name: 'count', type: Number, description: 'Nombre d\'utilisateurs à générer (1-1000)', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Fichier JSON contenant les utilisateurs générés',
  })
  @ApiResponse({ status: 400, description: 'Paramètre count invalide' })
  async generateUsers(@Query('count') count: number, @Res() res: Response) {
    return this.usersService.generateUsers(count, res);
  }

  @Public()
  @Post('batch')
  @ApiOperation({ summary: 'Importer des utilisateurs depuis un fichier JSON' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({
    status: 201,
    description: 'Importation terminée avec un résumé',
  })
  @ApiResponse({ status: 400, description: 'Fichier invalide ou manquant' })
  @UseInterceptors(FileInterceptor('file')) 
  async importUsers(@UploadedFile() file: Express.Multer.File): Promise<BatchImportResult> {
    return this.usersService.importUsers(file);
  }

@UseGuards(JwtAuthGuard)
@Get('me')
@ApiBearerAuth()
@ApiOperation({ summary: 'Obtenir les informations de mon profil' })
@ApiResponse({
  status: 200,
  description: 'Informations de l\'utilisateur connecté',
  type: User,
})
@ApiResponse({ status: 401, description: 'Non authentifié' })
@ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
async getMyProfile(@Req() req: Request): Promise<User> {
  const userPayload = req.user as { email?: string };

  if (!userPayload?.email) {
    throw new UnauthorizedException('Utilisateur non authentifié');
  }

  const user = await this.usersService.findByEmail(userPayload.email);

  if (!user) {
    throw new NotFoundException('Utilisateur non trouvé');
  }

  return user;
}

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtenir le profil d\'un utilisateur par son username',
  })
  @ApiResponse({
    status: 200,
    description: 'Profil de l\'utilisateur',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findUserByUsername(@Param('username') username: string, @Req() req: Request) {
    const currentUser = req['user'];
    return this.usersService.findProfile(username, currentUser);
  }
}