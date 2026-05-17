import { Body, Controller, Get, Post, UseGuards, Req, Param, Patch, Delete, Query } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Get()
  getAll(
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('rating') rating?: string,
  ) {
    return this.listingsService.findAll({
      type,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      rating: rating ? parseFloat(rating) : undefined,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createListingDto: CreateListingDto) {
    return this.listingsService.create(req.user.id, createListingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-listings')
  getMyListings(@Req() req) {
    return this.listingsService.findByOperator(req.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() updateData: any) {
    return this.listingsService.update(req.user.id, id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.listingsService.remove(req.user.id, id);
  }
}
