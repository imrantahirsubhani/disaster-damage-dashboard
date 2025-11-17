'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { House } from "@/lib/api";
import { MapPin, Calendar, Home, Eye, Pencil, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { format } from "date-fns";
import { useState, useEffect } from "react";

interface HouseCardProps {
  house: House;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const damageTypeColors: Record<string, string> = {
  storm: "bg-blue-500/20 text-blue-700 border-blue-200 dark:text-blue-200 dark:border-blue-800",
  earthquake: "bg-amber-500/20 text-amber-700 border-amber-200 dark:text-amber-200 dark:border-amber-800",
  flood: "bg-cyan-500/20 text-cyan-700 border-cyan-200 dark:text-cyan-200 dark:border-cyan-800",
  fire: "bg-red-500/20 text-red-700 border-red-200 dark:text-red-200 dark:border-red-800",
};

export const HouseCard = ({ house, onView, onEdit, onDelete }: HouseCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    if (house.images.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % house.images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [house.images.length]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? house.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % house.images.length);
  };

  const damageColor = damageTypeColors[house.damageType.toLowerCase()] || "bg-gray-500/20 text-gray-700 border-gray-200 dark:text-gray-200 dark:border-gray-800";
  const currentImage = house.images[currentImageIndex];

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-border/80 group bg-card/95 backdrop-blur-sm">
      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
        {house.images.length > 0 ? (
          <>
            <img
              src={currentImage || "/placeholder.svg"}
              alt={house.houseLocation}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            {house.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50">
            <Home className="h-24 w-24 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/0" />
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Badge className={`shadow-lg font-bold border ${damageColor}`}>
            {house.damageType}
          </Badge>
          {house.images.length > 1 && (
            <div className="bg-black/60 text-white text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-md border border-white/10">
              {currentImageIndex + 1}/{house.images.length}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-bold text-lg mb-2 line-clamp-1 text-foreground">{house.houseLocation}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{house.damageDescription}</p>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground bg-muted/50 rounded-lg p-3 hover:bg-muted/70 transition-colors">
            <Home className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="font-medium">{house.houseSize} Marla</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground bg-muted/50 rounded-lg p-3 hover:bg-muted/70 transition-colors">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="line-clamp-1 font-medium">{house.reportedBy}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground bg-muted/50 rounded-lg p-3 hover:bg-muted/70 transition-colors">
            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="font-medium">{format(new Date(house.damageTime), "MMM d, yyyy")}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50 flex gap-2">
          <Button onClick={() => onView(house._id)} className="flex-1 font-semibold shadow-md hover:shadow-lg transition-all duration-200" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Details
            <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
          <Button onClick={() => onEdit(house._id)} variant="outline" size="sm" className="px-3 hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button onClick={() => onDelete(house._id)} variant="outline" size="sm" className="px-3 hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
