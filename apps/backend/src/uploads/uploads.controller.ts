import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { SupabaseStorageService } from '../common/supabase-storage/supabase-storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private storageService: SupabaseStorageService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }
    
    try {
      const result = await this.storageService.uploadFile(file, 'general');
      return {
        url: result.secure_url,
        cloudinaryId: result.public_id,
      };
    } catch (error) {
      throw new BadRequestException('Erreur lors de l\'upload vers Cloudinary');
    }
  }
}
