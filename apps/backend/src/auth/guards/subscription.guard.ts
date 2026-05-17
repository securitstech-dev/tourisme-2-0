import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;
    
    // Si c'est un ADMIN, il a toujours accès
    if (user.role === 'ADMIN') return true;

    // Si c'est un OPERATOR, on vérifie son abonnement
    if (user.role === 'OPERATOR') {
      const operator = await this.prisma.operator.findUnique({
        where: { userId: user.id },
        select: { subscriptionEnd: true }
      });

      if (!operator) {
        throw new ForbiddenException('Profil opérateur non trouvé');
      }

      if (!operator.subscriptionEnd || operator.subscriptionEnd < new Date()) {
        throw new ForbiddenException('Votre abonnement a expiré. Veuillez renouveler votre pack pour continuer.');
      }

      return true;
    }

    return true; // Pour les touristes, pas de restriction d'abonnement ici
  }
}
