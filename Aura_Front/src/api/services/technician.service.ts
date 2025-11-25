import { ApiClient } from '../axios.config';
import { Technician, PaginatedResponse, ServiceCategory } from '../../types';

export class TechnicianService {
  private static BASE = '/technicians';
  
  static async getAll(page = 0, size = 10): Promise<PaginatedResponse<Technician>> {
    return ApiClient.get<PaginatedResponse<Technician>>(this.BASE, {
      params: { page, size }
    });
  }
  
  static async getById(id: number): Promise<Technician> {
    return ApiClient.get<Technician>(`${this.BASE}/${id}`);
  }
  
  static async search(specialty?: ServiceCategory, minRating?: number, page = 0, size = 10): Promise<PaginatedResponse<Technician>> {
    return ApiClient.get<PaginatedResponse<Technician>>(`${this.BASE}/search`, {
      params: { specialty, minRating, page, size }
    });
  }
  
  static async getByService(serviceId: number): Promise<Technician[]> {
    return ApiClient.get<Technician[]>(`${this.BASE}/by-service/${serviceId}`);
  }
  
  static async update(id: number, data: Partial<Technician>): Promise<Technician> {
    return ApiClient.put<Technician>(`${this.BASE}/${id}`, data);
  }
}
