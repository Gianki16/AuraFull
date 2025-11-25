import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { PrivateRoute } from './routes/PrivateRoute';
import { PublicRoute } from './routes/PublicRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard
import { DashboardPage } from './pages/dashboard/DashboardPage';

// Services
import { ServicesPage } from './pages/services/ServicesPage';
import { ServiceDetailPage } from './pages/services/ServiceDetailPage';

// Reservations
import { ReservationsPage } from './pages/reservations/ReservationsPage';
import { CreateReservationPage } from './pages/reservations/CreateReservationPage';

// Profile
import { ProfilePage } from './pages/profile/ProfilePage';

// Role
import { Role } from './types';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute restricted>
            <LoginPage />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute restricted>
            <RegisterPage />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Services */}
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          
          {/* Reservations */}
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/reservations/create" element={<CreateReservationPage />} />
          
          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <PrivateRoute allowedRoles={[Role.ADMIN, Role.SUPERADMIN]}>
              <div>Admin Panel (To be implemented)</div>
            </PrivateRoute>
          } />
        </Route>
        
        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
