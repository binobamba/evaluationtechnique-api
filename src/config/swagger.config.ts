  import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
  import { INestApplication } from '@nestjs/common';

  export const setupSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
      .setTitle('API DE TESTE D\'EVALUATION TECHNIQUE ')
      .setDescription("Ceci est l'OpenAPI pour la gestion des utilisateurs")
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  };
