import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan, PaymentStatus } from '@prisma/client';
import { MailService } from '../common/mail/mail.service';
import { SUBSCRIPTION_RULES } from '../common/business-rules';

@Injectable()
export class SubscriptionsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getOperatorByUserId(userId: string) {
    const operator = await this.prisma.operator.findUnique({
      where: { userId },
    });
    if (!operator) throw new NotFoundException('Profil opérateur introuvable');
    return operator;
  }

  /**
   * Crée une intention d'abonnement pour un opérateur (statut UNPAID par défaut)
   */
  async subscribe(operatorId: string, plan: SubscriptionPlan, months: number = 1) {
    const operator = await this.prisma.operator.findUnique({
      where: { id: operatorId },
    });

    if (!operator) {
      throw new NotFoundException('Opérateur introuvable');
    }

    const selectedMonths = Math.max(1, Math.min(months, 24));
    const fullYears = Math.floor(selectedMonths / 12);
    const remainingMonths = selectedMonths % 12;
    const rules = SUBSCRIPTION_RULES[plan];
    const amount = (rules.annualPrice * fullYears) + (rules.monthlyPrice * remainingMonths);
    
    // On ne calcule pas encore la date de fin réelle, on le fera à la confirmation du paiement
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + selectedMonths);

    return this.prisma.subscription.create({
      data: {
        operatorId,
        plan,
        amount,
        startDate,
        endDate,
        isActive: false, // Inactif jusqu'au paiement
        paymentStatus: PaymentStatus.UNPAID,
      },
    });
  }

  /**
   * Confirme le paiement et active l'abonnement
   */
  async confirmPayment(subscriptionId: string, method: string, reference: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        operator: {
          include: { user: true }
        }
      }
    });

    if (!subscription) {
      throw new NotFoundException('Abonnement introuvable');
    }

    if (subscription.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Cet abonnement est déjà payé');
    }

    const updatedSub = await this.prisma.$transaction(async (tx) => {
      // 1. Marquer l'abonnement comme payé et actif
      const sub = await tx.subscription.update({
        where: { id: subscriptionId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          isActive: true,
          mobileMoneyRef: method.includes('MOBILE') ? reference : undefined,
          stripeSubId: method === 'STRIPE' ? reference : undefined,
        },
      });

      // 2. Mettre à jour le profil de l'opérateur avec la nouvelle date d'expiration
      await tx.operator.update({
        where: { id: subscription.operatorId },
        data: {
          subscriptionPlan: subscription.plan,
          subscriptionEnd: subscription.endDate,
        },
      });

      return sub;
    });

    // Envoi de l'email de facture
    if (subscription.operator?.user?.email) {
      await this.mailService.sendSubscriptionInvoice(
        subscription.operator.user.email,
        `INV-${subscription.id.substring(0, 8).toUpperCase()}`,
        subscription.plan,
        subscription.amount
      );
    }

    return updatedSub;
  }

  /**
   * Récupère les données pour générer une facture
   */
  async getInvoice(subscriptionId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        operator: {
          include: { user: true }
        }
      }
    });

    if (!sub) throw new NotFoundException('Facture introuvable');

    return {
      invoiceNumber: `INV-${sub.id.substring(0, 8).toUpperCase()}`,
      date: sub.createdAt,
      operator: sub.operator.businessName,
      address: sub.operator.address,
      taxId: sub.operator.taxId,
      plan: sub.plan,
      amount: sub.amount,
      currency: sub.currency,
      status: sub.paymentStatus,
      period: {
        start: sub.startDate,
        end: sub.endDate
      }
    };
  }

  /**
   * Vérifie si un opérateur a un abonnement valide
   */
  async checkSubscriptionStatus(operatorId: string) {
    const operator = await this.prisma.operator.findUnique({
      where: { id: operatorId },
      select: { subscriptionEnd: true, subscriptionPlan: true },
    });

    if (!operator) return { isActive: false, plan: null };

    const now = new Date();
    const isActive = operator.subscriptionEnd ? operator.subscriptionEnd > now : false;

    return {
      isActive,
      plan: operator.subscriptionPlan,
      expiryDate: operator.subscriptionEnd,
    };
  }

  /**
   * Liste les abonnements d'un opérateur
   */
  async getOperatorSubscriptions(operatorId: string) {
    return this.prisma.subscription.findMany({
      where: { operatorId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
