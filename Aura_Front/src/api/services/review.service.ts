import { ApiClient } from '../axios.config';
import { Review, CreateReviewRequest, PaginatedResponse } from '../../types';

export class ReviewService {
  private static BASE = '/reviews';
  
  static async create(data: CreateReviewRequest): Promise<Review> {
    return ApiClient.post<Review>(this.BASE, data);
  }
  
  static async getByTechnician(technicianId: number, page = 0, size = 10): Promise<PaginatedResponse<Review>> {
    return ApiClient.get<PaginatedResponse<Review>>(`${this.BASE}/technician/${technicianId}`, {
      params: { page, size }
    });
  }
  
  static async getByUser(userId: number): Promise<Review[]> {
    return ApiClient.get<Review[]>(`${this.BASE}/user/${userId}`);
  }
  
  static async delete(id: number): Promise<void> {
    return ApiClient.delete<void>(`${this.BASE}/${id}`);
  }
}
