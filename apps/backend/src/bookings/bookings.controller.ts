import { Body, Controller, Get, Post, UseGuards, Req, Patch, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  create(@Req() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, createBookingDto);
  }

  @Get('my-bookings')
  getMyBookings(@Req() req) {
    return this.bookingsService.findByUser(req.user.id);
  }

  @Get('operator')
  getOperatorBookings(@Req() req) {
    return this.bookingsService.findByOperator(req.user.id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.bookingsService.updateStatus(id, status as any);
  }
}
