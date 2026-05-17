import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, dto);
  }

  @Get('listing/:listingId')
  getByListing(@Param('listingId') listingId: string) {
    return this.reviewsService.getByListing(listingId);
  }

  @Get('operator/my-reviews')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR)
  getMyReviews(@Req() req) {
    // Note: on suppose que req.user.operatorId est disponible ou on le cherche via userId
    // Pour simplifier ici, on utilise l'ID utilisateur qui est relié à l'opérateur
    return this.reviewsService.getForOperator(req.user.id);
  }
}
