import { ApiClient } from '../axios.config';
import { Payment, CreatePaymentRequest } from '../../types';

export class PaymentService {
  private static BASE = '/payments';

  static async create(data: CreatePaymentRequest): Promise<Payment> {
    return ApiClient.post<Payment>(this.BASE, data);
  }

  static async getById(id: number): Promise<Payment> {
    return ApiClient.get<Payment>(`${this.BASE}/${id}`);
  }

  static async getByReservation(reservationId: number): Promise<Payment> {
    return ApiClient.get<Payment>(`${this.BASE}/reservation/${reservationId}`);
  }

  static async process(id: number): Promise<Payment> {
    return ApiClient.patch<Payment>(`${this.BASE}/${id}/process`);
  }

  static async refund(id: number, reason: string): Promise<Payment> {
    return ApiClient.patch<Payment>(`${this.BASE}/${id}/refund`, { reason });
  }
}
