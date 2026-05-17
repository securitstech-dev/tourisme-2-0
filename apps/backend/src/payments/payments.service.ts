import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MtnMomoProvider } from './providers/mtn-momo.provider';
import { AirtelMomoProvider } from './providers/airtel-momo.provider';
import { PaymentMethod, ReservationStatus, PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

import { MailService } from '../common/mail/mail.service';

@Injectable()
export class PaymentsService {
  private stripe: any;

  constructor(
    private prisma: PrismaService,
    private mtnMomo: MtnMomoProvider,
    private airtelMomo: AirtelMomoProvider,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  private getStripeClient() {
    if (this.stripe) {
      return this.stripe;
    }

    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new InternalServerErrorException('Stripe is not configured.');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-01-27.acacia' as any,
    });

    return this.stripe;
  }

  async createStripePaymentIntent(reservationId: string) {
    const stripe = this.getStripeClient();
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { listing: true },
    });

    if (!reservation) throw new NotFoundException('Réservation introuvable');

    try {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(reservation.totalPrice),
        currency: 'xaf',
        metadata: { reservationId },
      });

      await this.prisma.reservation.update({
        where: { id: reservationId },
        data: { 
          stripePaymentId: intent.id,
          paymentStatus: PaymentStatus.PENDING
        },
      });

      return {
        clientSecret: intent.client_secret,
        amount: reservation.totalPrice,
      };
    } catch {
      throw new InternalServerErrorException('Erreur lors de la création de l\'intention de paiement');
    }
  }

  async handleStripeWebhook(payload: any, signature: string) {
    const stripe = this.getStripeClient();
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';
    let event: any;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch {
      throw new InternalServerErrorException('Webhook Signature Verification Failed');
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as any;
      const reservationId = intent.metadata.reservationId;

      const reservation = await this.prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { listing: true, tourist: true },
      });

      if (reservation) {
        await this.prisma.payment.create({
          data: {
            reservationId,
            amount: intent.amount,
            currency: intent.currency.toUpperCase(),
            method: PaymentMethod.STRIPE,
            stripePaymentId: intent.id,
            status: PaymentStatus.PAID,
            paidAt: new Date(),
          },
        });

        await this.prisma.reservation.update({
          where: { id: reservationId },
          data: {
            paymentStatus: PaymentStatus.PAID,
            status: ReservationStatus.CONFIRMED,
          },
        });

        await this.mailService.sendBookingConfirmation(
          reservation.tourist.email,
          reservation.id,
          reservation.listing.title,
          reservation.totalPrice
        );
      }
    }

    return { received: true };
  }

  async initiateMobilePayment(reservationId: string, phoneNumber: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { listing: true },
    });

    if (!reservation) throw new NotFoundException('Réservation introuvable');

    const provider = phoneNumber.startsWith('05') || phoneNumber.startsWith('04') 
      ? this.airtelMomo 
      : this.mtnMomo;

    const response = await provider.processPayment(
      reservation.totalPrice,
      phoneNumber,
      `Paiement pour ${reservation.listing.title}`
    );

    if (response.success) {
      const status = response.status === 'SUCCESS' ? PaymentStatus.PAID : PaymentStatus.PENDING;
      await this.prisma.payment.create({
        data: {
          reservationId,
          amount: reservation.totalPrice,
          currency: 'XAF',
          method: phoneNumber.startsWith('05') || phoneNumber.startsWith('04') 
            ? PaymentMethod.MOBILE_MONEY_AIRTEL 
            : PaymentMethod.MOBILE_MONEY_MTN,
          mobileMoneyRef: response.transactionId,
          status: status,
        },
      });

      if (status === PaymentStatus.PENDING || status === PaymentStatus.PAID) {
        const updatedRes = await this.prisma.reservation.update({
          where: { id: reservationId },
          data: { 
            paymentStatus: status,
            status: status === PaymentStatus.PAID ? ReservationStatus.CONFIRMED : ReservationStatus.PENDING
          },
          include: { tourist: true, listing: true }
        });

        // Envoi d'email de confirmation immédiat en cas de succès (utile pour la simulation)
        if (status === PaymentStatus.PAID && updatedRes.tourist?.email) {
          await this.mailService.sendBookingConfirmation(
            updatedRes.tourist.email,
            updatedRes.id,
            updatedRes.listing.title,
            updatedRes.totalPrice
          );
        }
      }
    }

    return response;
  }

  async verifyPayment(transactionId: string) {
    const provider = transactionId.startsWith('AIRTEL-') ? this.airtelMomo : this.mtnMomo;
    const response = await provider.checkStatus(transactionId);

    if (response.status === 'SUCCESS') {
      const payment = await this.prisma.payment.findFirst({
        where: { mobileMoneyRef: transactionId },
      });

      if (payment && payment.status !== PaymentStatus.PAID) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.PAID,
            paidAt: new Date(),
          },
        });

        const updatedRes = await this.prisma.reservation.update({
          where: { id: payment.reservationId },
          data: { paymentStatus: PaymentStatus.PAID, status: ReservationStatus.CONFIRMED },
          include: { tourist: true, listing: true }
        });

        if (updatedRes.tourist?.email) {
          await this.mailService.sendBookingConfirmation(
            updatedRes.tourist.email,
            updatedRes.id,
            updatedRes.listing.title,
            updatedRes.totalPrice
          );
        }
      }
    }

    return response;
  }
}
