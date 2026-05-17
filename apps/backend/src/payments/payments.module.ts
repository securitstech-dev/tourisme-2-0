import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MtnMomoProvider } from './providers/mtn-momo.provider';
import { AirtelMomoProvider } from './providers/airtel-momo.provider';

@Module({
  providers: [PaymentsService, MtnMomoProvider, AirtelMomoProvider],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
