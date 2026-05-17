import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentType } from '@prisma/client';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SupabaseStorageService } from '../common/supabase-storage/supabase-storage.service';
import { UpdateOperatorProfileDto } from './dto/update-operator-profile.dto';
import { OperatorsService } from './operators.service';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

const allowedDocumentMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const maxDocumentSize = 10 * 1024 * 1024;

@Controller('operators')
@UseGuards(JwtAuthGuard)
export class OperatorsController {
  private readonly logger = new Logger(OperatorsController.name);

  constructor(
    private operatorsService: OperatorsService,
    private storageService: SupabaseStorageService,
  ) {}

  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    return this.operatorsService.findByUserId(req.user.id);
  }

  @Get('stats')
  async getStats(@Req() req: AuthenticatedRequest) {
    return this.operatorsService.getStats(req.user.id);
  }

  @Patch('profile')
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() data: UpdateOperatorProfileDto) {
    const operator = await this.operatorsService.findByUserId(req.user.id);

    if (!operator) {
      throw new NotFoundException('Profil operateur non trouve');
    }

    return this.operatorsService.update(operator.id, data);
  }

  @Post('documents/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: DocumentType,
  ) {
    if (!file) {
      throw new BadRequestException('Fichier obligatoire.');
    }

    if (!Object.values(DocumentType).includes(type)) {
      throw new BadRequestException('Type de document non autorise.');
    }

    if (!allowedDocumentMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Format de document non autorise.');
    }

    if (file.size > maxDocumentSize) {
      throw new BadRequestException('Le document depasse 10 Mo.');
    }

    const operator = await this.operatorsService.findByUserId(req.user.id);

    if (!operator) {
      throw new NotFoundException('Operateur non trouve');
    }

    try {
      const result = await this.storageService.uploadFile(file, 'operators/documents');

      return this.operatorsService.uploadDocument(operator.id, type, result.url, result.public_id);
    } catch (error) {
      this.logger.error('Echec upload document operateur', error instanceof Error ? error.stack : undefined);
      throw error;
    }
  }
}
