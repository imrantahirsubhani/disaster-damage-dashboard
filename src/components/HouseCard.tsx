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
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-border group">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {house.images.length > 0 ? (
          <img
            src={house.images[0]}
            alt={house.houseLocation}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50">
            <Home className="h-20 w-20 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        <Badge className={`absolute top-4 right-4 shadow-lg font-semibold ${damageColor}`}>
          {house.damageType}
        </Badge>
        {house.images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
            +{house.images.length - 1} more
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-xl mb-2 line-clamp-1 text-foreground">{house.houseLocation}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{house.damageDescription}</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground bg-muted/30 rounded-lg p-2.5">
            <Home className="h-4 w-4 text-primary" />
            <span className="font-medium">{house.houseSize} Marla</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground bg-muted/30 rounded-lg p-2.5">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1 font-medium">{house.reportedBy}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground bg-muted/30 rounded-lg p-2.5">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">{format(new Date(house.damageTime), "PPP")}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50 flex gap-2">
          <Button onClick={() => onView(house._id)} variant="default" size="sm" className="flex-1 font-semibold">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button onClick={() => onEdit(house._id)} variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button onClick={() => onDelete(house._id)} variant="outline" size="sm" className="hover:bg-destructive hover:text-destructive-foreground">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
