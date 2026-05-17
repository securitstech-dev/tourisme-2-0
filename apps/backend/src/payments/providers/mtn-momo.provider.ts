import { Injectable, Logger } from '@nestjs/common';
import { PaymentProvider, PaymentResponse } from './payment-provider.interface';

@Injectable()
export class MtnMomoProvider implements PaymentProvider {
  private readonly logger = new Logger(MtnMomoProvider.name);

  async processPayment(amount: number, phoneNumber: string, description: string): Promise<PaymentResponse> {
    this.logger.log(`Processing MTN MoMo payment of ${amount} FCFA for ${phoneNumber}`);
    
    // Simuler un appel API
    return {
      success: true,
      transactionId: `MTN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      message: 'Paiement effectué avec succès (Simulation).',
      status: 'SUCCESS',
    };
  }

  async checkStatus(transactionId: string): Promise<PaymentResponse> {
    // Simuler la vérification du statut
    return {
      success: true,
      transactionId,
      message: 'Paiement effectué avec succès.',
      status: 'SUCCESS',
    };
  }
}
