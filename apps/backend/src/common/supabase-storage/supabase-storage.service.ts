import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private readonly supabase?: SupabaseClient;
  private readonly logger = new Logger(SupabaseStorageService.name);
  private readonly bucketName = 'congo-tourisme-storage';

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      this.logger.warn('Supabase URL or Key is missing. Storage will not work.');
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'general') {
    if (!this.supabase) {
      throw new ServiceUnavailableException('Supabase storage is not configured.');
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const path = `${folder}/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Supabase Upload Error: ${error.message}`);
      throw error;
    }

    // Récupérer l'URL publique
    const { data: { publicUrl } } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);

    return {
      url: publicUrl,
      secure_url: publicUrl, // Pour compatibilité avec l'ancien code Cloudinary
      public_id: path,
    };
  }
}
