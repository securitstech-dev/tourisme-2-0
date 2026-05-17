import { Injectable, Logger } from '@nestjs/common';
import { PaymentProvider, PaymentResponse } from './payment-provider.interface';

@Injectable()
export class AirtelMomoProvider implements PaymentProvider {
  private readonly logger = new Logger(AirtelMomoProvider.name);

  async processPayment(amount: number, phoneNumber: string, description: string): Promise<PaymentResponse> {
    this.logger.log(`Processing Airtel Money payment of ${amount} FCFA for ${phoneNumber}`);
    
    // Simuler un appel API Airtel
    return {
      success: true,
      transactionId: `AIRTEL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      message: 'Paiement effectué avec succès (Simulation).',
      status: 'SUCCESS',
    };
  }

  async checkStatus(transactionId: string): Promise<PaymentResponse> {
    // Simuler la vérification du statut
    return {
      success: true,
      transactionId,
      message: 'Paiement Airtel Money confirmé.',
      status: 'SUCCESS',
    };
  }
}
