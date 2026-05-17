export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
}

export interface PaymentProvider {
  processPayment(amount: number, phoneNumber: string, description: string): Promise<PaymentResponse>;
  checkStatus(transactionId: string): Promise<PaymentResponse>;
}
