import { Injectable } from '@nestjs/common';
import { DocumentType, Operator, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

/** Service metier des dossiers, documents et statistiques operateur. */
@Injectable()
export class OperatorsService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.operator.findUnique({
      where: { userId },
      include: { documents: true },
    });
  }

  async create(data: Prisma.OperatorUncheckedCreateInput): Promise<Operator> {
    return this.prisma.operator.create({ data });
  }

  async update(id: string, data: Prisma.OperatorUpdateInput): Promise<Operator> {
    return this.prisma.operator.update({ where: { id }, data });
  }

  async uploadDocument(operatorId: string, type: DocumentType, url: string, cloudinaryId: string) {
    const existingDocument = await this.prisma.operatorDocument.findFirst({
      where: { operatorId, type },
      select: { id: true },
    });

    return this.prisma.operatorDocument.upsert({
      where: {
        id: existingDocument?.id ?? 'new-document-placeholder',
      },
      update: { url, cloudinaryId, status: 'PENDING' },
      create: {
        operatorId,
        type,
        url,
        cloudinaryId,
        status: 'PENDING',
      },
    });
  }

  /** Calcule les statistiques reelles de l'operateur pour son dashboard. */
  async getStats(userId: string) {
    const operator = await this.prisma.operator.findUnique({
      where: { userId },
    });

    if (!operator) {
      return { revenue: 0, bookings: 0, visitors: 0, conversion: 0 };
    }

    // Debut du mois courant.
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Reservations du mois et revenus payes.
    const [allBookings, monthBookings, paidPayments, activeListings] = await Promise.all([
      this.prisma.reservation.count({
        where: { operatorId: operator.id },
      }),
      this.prisma.reservation.count({
        where: {
          operatorId: operator.id,
          createdAt: { gte: startOfMonth },
        },
      }),
      this.prisma.payment.aggregate({
        where: {
          reservation: { operatorId: operator.id },
          status: 'PAID',
          paidAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      this.prisma.listing.count({
        where: { operatorId: operator.id, isAvailable: true, deletedAt: null },
      }),
    ]);

    const revenue = paidPayments._sum.amount ?? 0;
    const conversion = activeListings > 0
      ? Number(((monthBookings / (activeListings * 10)) * 100).toFixed(1))
      : 0;

    return {
      revenue,
      bookings: allBookings,
      visitors: monthBookings * 8,
      conversion: Math.min(conversion, 100),
      subscription: {
        plan: operator.subscriptionPlan,
        endDate: operator.subscriptionEnd,
        trialEndsAt: operator.trialEndsAt,
        isValidated: operator.isValidated,
      },
    };
  }
}
