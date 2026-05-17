import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { OperatorsModule } from './operators/operators.module';
import { ListingsModule } from './listings/listings.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { UploadsModule } from './uploads/uploads.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './common/mail/mail.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SupabaseStorageModule } from './common/supabase-storage/supabase-storage.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ChatbotModule,
    OperatorsModule,
    ListingsModule,
    BookingsModule,
    PaymentsModule,
    UploadsModule,
    AdminModule,
    MailModule,
    SubscriptionsModule,
    ReviewsModule,
    SupabaseStorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
