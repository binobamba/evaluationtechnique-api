import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Fichier JSON contenant les utilisateurs',
  })
  file: any;
}
