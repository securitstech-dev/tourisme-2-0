import { Body, Controller, Post, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('chatbot')
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Post('ask')
  // Route publique ou protégée selon besoin. Ici, on la laisse accessible pour les touristes.
  ask(@Body() chatDto: ChatDto) {
    return this.chatbotService.askKongo(chatDto.message);
  }

  // Routes d'administration pour "éduquer" le chatbot
  @Get('knowledge')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getKnowledge() {
    return this.chatbotService.getAllKnowledge();
  }

  @Post('knowledge')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  addKnowledge(@Body() data: { topic: string; content: string }) {
    return this.chatbotService.addKnowledge(data);
  }

  @Delete('knowledge/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteKnowledge(@Param('id') id: string) {
    return this.chatbotService.deleteKnowledge(id);
  }
}
