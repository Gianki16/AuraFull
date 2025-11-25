import { Technician } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

interface TechnicianCardProps {
  technician: Technician;
  onSelect: (technician: Technician) => void;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({ 
  technician, 
  onSelect 
}) => {
  const getInitials = () => {
    return `${technician.firstName[0]}${technician.lastName[0]}`.toUpperCase();
  };
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">
                {technician.firstName} {technician.lastName}
              </h3>
              {technician.isActive && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{technician.averageRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({technician.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {technician.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {technician.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
          {technician.specialties.length > 3 && (
            <Badge variant="outline">
              +{technician.specialties.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={() => onSelect(technician)}>
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};
