import { Controller, Post, Body, UseGuards, Req, Headers, Get, Query } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('stripe/create-intent')
  @UseGuards(JwtAuthGuard)
  createStripeIntent(@Body('reservationId') reservationId: string) {
    return this.paymentsService.createStripePaymentIntent(reservationId);
  }

  @Post('stripe/webhook')
  handleWebhook(
    @Req() req: Request & { body: any },
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleStripeWebhook(req.body, signature);
  }

  @Post('mobile-money')
  @UseGuards(JwtAuthGuard)
  initiate(@Body('reservationId') reservationId: string, @Body('phone') phone: string) {
    return this.paymentsService.initiateMobilePayment(reservationId, phone);
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  verify(@Query('transactionId') transactionId: string) {
    return this.paymentsService.verifyPayment(transactionId);
  }
}
