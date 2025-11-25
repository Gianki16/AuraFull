export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    registerDate: string;
    role: 'USER' | 'TECHNICIAN' | 'ADMIN' | 'SUPERADMIN';
    totalReservations?: number;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    category: ServiceCategory;
    totalTechnicians: number;
    totalReservations: number;
}

export type ServiceCategory =
    | 'PLUMBING'
    | 'ELECTRICITY'
    | 'CARPENTRY'
    | 'PAINTING'
    | 'CLEANING'
    | 'APPLIANCE_REPAIR'
    | 'HVAC'
    | 'IT_SUPPORT'
    | 'LOCKSMITH'
    | 'GENERAL_MAINTENANCE'
    | 'OTHER';

export interface Technician {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    description?: string;
    specialties: ServiceCategory[];
    averageRating: number;
    totalServices: number;
    totalCertifications: number;
    validatedCertifications: number;
}

export interface Reservation {
    id: number;
    userId: number;
    userName: string;
    technicianId: number;
    technicianName: string;
    serviceId: number;
    serviceName: string;
    reservationDate: string;
    serviceDate: string;
    startTime: string;
    endTime?: string;
    address: string;
    status: ReservationStatus;
    createdAt: string;
    updatedAt: string;
    totalAmount: number;
    hasReview: boolean;
}

export type ReservationStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW';

export interface Review {
    id: number;
    reservationId: number;
    userName: string;
    technicianName: string;
    serviceName: string;
    comment: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    status: 'ACTIVE' | 'EDITED' | 'DELETED';
}

export interface Payment {
    id: number;
    reservationId: number;
    amount: number;
    paymentDate: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
}

export type PaymentMethod =
    | 'CREDIT_CARD'
    | 'DEBIT_CARD'
    | 'CASH'
    | 'BANK_TRANSFER'
    | 'MOBILE_WALLET';

export type PaymentStatus =
    | 'PENDING'
    | 'COMPLETED'
    | 'FAILED'
    | 'REFUNDED'
    | 'CANCELLED';

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}