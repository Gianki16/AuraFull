import { useEffect, useState } from 'react';
import { useAuth, useApi } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ReservationService, ServiceService } from '@/api';
import { Calendar, DollarSign, Star, Wrench } from 'lucide-react';
import { ReservationCard } from '@/components/features/ReservationCard';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, isUser } = useAuth();
  const navigate = useNavigate();

  const { data: reservations, loading: loadingReservations, execute: fetchReservations } = useApi(
    () => ReservationService.getMy(0, 5)
  );

  const { data: services, loading: loadingServices, execute: fetchServices } = useApi(
    () => ServiceService.getAll(0, 6)
  );

  useEffect(() => {
    fetchReservations();
    fetchServices();
  }, []);

  const stats = [
    {
      title: 'Active Reservations',
      value: reservations?.content.filter(r => r.status === 'CONFIRMED').length || 0,
      icon: Calendar,
      color: 'text-blue-500',
    },
    {
      title: 'Total Spent',
      value: `S/ ${reservations?.content.reduce((acc, r) => acc + r.finalPrice, 0).toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'Services Used',
      value: new Set(reservations?.content.map(r => r.service.id)).size || 0,
      icon: Wrench,
      color: 'text-purple-500',
    },
    {
      title: 'Reviews Given',
      value: reservations?.content.filter(r => r.status === 'COMPLETED').length || 0,
      icon: Star,
      color: 'text-yellow-500',
    },
  ];

  if (loadingReservations || loadingServices) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}! 👋</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your services today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reservations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reservations?.content.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No reservations yet. Book a service to get started!
              </p>
            ) : (
              reservations?.content.slice(0, 3).map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onViewDetails={(r) => navigate(`/reservations/${r.id}`)}
                  showActions={false}
                />
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {(Array.isArray(services) ? services : services?.content || []).slice(0, 4).map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => navigate('/services')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Wrench className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.category}</p>
                    </div>
                  </div>
                  <span className="font-semibold">S/ {service.suggestedPrice}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
