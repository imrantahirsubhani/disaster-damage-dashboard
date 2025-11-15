import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { House } from "@/lib/api";
import { MapPin, Calendar, Home, Eye, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface HouseCardProps {
  house: House;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const damageTypeColors: Record<string, string> = {
  storm: "bg-info text-info-foreground",
  earthquake: "bg-warning text-warning-foreground",
  flood: "bg-primary text-primary-foreground",
  fire: "bg-destructive text-destructive-foreground",
};

export const HouseCard = ({ house, onView, onEdit, onDelete }: HouseCardProps) => {
  const damageColor = damageTypeColors[house.damageType.toLowerCase()] || "bg-muted text-muted-foreground";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {house.images.length > 0 ? (
          <img
            src={house.images[0]}
            alt={house.houseLocation}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Home className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        <Badge className={`absolute top-3 right-3 ${damageColor}`}>
          {house.damageType}
        </Badge>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{house.houseLocation}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{house.damageDescription}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Home className="h-4 w-4" />
            <span>{house.houseSize} Marla</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{house.houseLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(house.damageTime), "PPP")}</span>
          </div>
        </div>

        <div className="pt-4 border-t flex gap-2">
          <Button onClick={() => onView(house._id)} variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button onClick={() => onEdit(house._id)} variant="outline" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button onClick={() => onDelete(house._id)} variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
