import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { OperatorsModule } from '../operators/operators.module';

@Module({
  imports: [OperatorsModule],
  providers: [ListingsService],
  controllers: [ListingsController],
})
export class ListingsModule {}
