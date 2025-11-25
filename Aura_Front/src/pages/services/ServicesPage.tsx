import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi, useDebounce, usePagination } from '@/hooks';
import { ServiceService } from '@/api';
import { ServiceCategory } from '@/types';
import { ServiceCard } from '@/components/features/ServiceCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Wrench } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'ALL'>('ALL');
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const { page, size, updatePagination, goToPage } = usePagination(0, 12);
  
  const { data, loading, execute } = useApi(
    () => ServiceService.getAll(page, size)
  );
  
  useEffect(() => {
    execute();
  }, [page, size]);
  
  useEffect(() => {
    if (data) {
      updatePagination(data);
    }
  }, [data, updatePagination]);
  
  const filteredServices = data?.content.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         service.description.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Available Services</h1>
        <p className="text-muted-foreground mt-2">
          Browse and book professional services for your home
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {Object.values(ServiceCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {category.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredServices.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services found"
          description="Try adjusting your search or filter criteria"
        />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={() => navigate(`/services/${service.id}`)}
              />
            ))}
          </div>
          
          {data && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              totalItems={data.totalElements}
              itemsPerPage={size}
              onPageChange={goToPage}
            />
          )}
        </>
      )}
    </div>
  );
};
