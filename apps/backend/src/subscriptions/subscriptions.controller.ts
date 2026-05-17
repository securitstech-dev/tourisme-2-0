import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionPlan } from '@prisma/client';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('subscribe')
  async subscribe(@Req() req, @Body() body: { plan: SubscriptionPlan, months: number }) {
    const operator = await this.subscriptionsService.getOperatorByUserId(req.user.id);
    return this.subscriptionsService.subscribe(operator.id, body.plan, body.months);
  }

  @Get('my-subscriptions')
  async getMySubscriptions(@Req() req) {
    const operator = await this.subscriptionsService.getOperatorByUserId(req.user.id);
    return this.subscriptionsService.getOperatorSubscriptions(operator.id);
  }

  @Get('status')
  async getStatus(@Req() req) {
    const operator = await this.subscriptionsService.getOperatorByUserId(req.user.id);
    return this.subscriptionsService.checkSubscriptionStatus(operator.id);
  }

  @Get('invoice/:id')
  async getInvoice(@Param('id') id: string) {
    return this.subscriptionsService.getInvoice(id);
  }

  @Post('confirm-payment')
  async confirmPayment(@Body() body: { subscriptionId: string, method: string, reference: string }) {
    return this.subscriptionsService.confirmPayment(body.subscriptionId, body.method, body.reference);
  }
}
