import { ApiClient } from '../axios.config';
import { Service, PaginatedResponse, ServiceCategory } from '../../types';

export class ServiceService {
  private static BASE = '/services';
  
  static async getAll(page = 0, size = 20): Promise<PaginatedResponse<Service>> {
    return ApiClient.get<PaginatedResponse<Service>>(this.BASE, {
      params: { page, size }
    });
  }
  
  static async getById(id: number): Promise<Service> {
    return ApiClient.get<Service>(`${this.BASE}/${id}`);
  }
  
  static async getByCategory(category: ServiceCategory): Promise<Service[]> {
    return ApiClient.get<Service[]>(`${this.BASE}/category/${category}`);
  }
  
  static async search(query: string, category?: ServiceCategory): Promise<Service[]> {
    return ApiClient.get<Service[]>(`${this.BASE}/search`, {
      params: { query, category }
    });
  }
  
  static async create(data: Omit<Service, 'id' | 'createdAt'>): Promise<Service> {
    return ApiClient.post<Service>(this.BASE, data);
  }
  
  static async update(id: number, data: Partial<Service>): Promise<Service> {
    return ApiClient.put<Service>(`${this.BASE}/${id}`, data);
  }
  
  static async delete(id: number): Promise<void> {
    return ApiClient.delete<void>(`${this.BASE}/${id}`);
  }
}
