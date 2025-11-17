import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { CreateHouseData } from "@/lib/api";
import { Upload, X, AlertCircle } from 'lucide-react';

interface HouseFormProps {
  initialData?: {
    _id?: string;
    houseLocation?: string;
    houseSize?: string;
    damageDescription?: string;
    damageTime?: string;
    damageType?: string;
    reportedBy?: string;
    contactInfo?: string;
    existingImages?: string[];
  };
  onSubmit: (data: CreateHouseData, replaceImages?: boolean) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const HouseForm = ({ initialData, onSubmit, onCancel, isLoading }: HouseFormProps) => {
  const [formData, setFormData] = useState<CreateHouseData>({
    houseLocation: initialData?.houseLocation || "",
    houseSize: initialData?.houseSize || "",
    damageDescription: initialData?.damageDescription || "",
    damageTime: initialData?.damageTime || new Date().toISOString().slice(0, 16),
    damageType: initialData?.damageType || "",
    reportedBy: initialData?.reportedBy || "",
    contactInfo: initialData?.contactInfo || "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState<string[]>(initialData?.existingImages || []);
  const [hasNewImages, setHasNewImages] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: files });
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
    setHasNewImages(true);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index) || [];
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setPreviewImages(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, initialData && hasNewImages);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Property Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="houseLocation" className="text-sm font-semibold">House Location *</Label>
              <Input
                id="houseLocation"
                value={formData.houseLocation}
                onChange={(e) => setFormData({ ...formData, houseLocation: e.target.value })}
                placeholder="Enter complete address"
                className="h-11 border-border/50 focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="houseSize" className="text-sm font-semibold">House Size (Marla) *</Label>
              <Input
                id="houseSize"
                value={formData.houseSize}
                onChange={(e) => setFormData({ ...formData, houseSize: e.target.value })}
                placeholder="e.g., 5, 10, 15"
                className="h-11 border-border/50 focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="damageType" className="text-sm font-semibold">Damage Type *</Label>
              <Select
                value={formData.damageType}
                onValueChange={(value) => setFormData({ ...formData, damageType: value })}
                required
              >
                <SelectTrigger className="h-11 border-border/50 focus:ring-2 focus:ring-primary/50">
                  <SelectValue placeholder="Select damage type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="storm">Storm</SelectItem>
                  <SelectItem value="earthquake">Earthquake</SelectItem>
                  <SelectItem value="flood">Flood</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="damageTime" className="text-sm font-semibold">Damage Time *</Label>
              <Input
                id="damageTime"
                type="datetime-local"
                value={formData.damageTime}
                onChange={(e) => setFormData({ ...formData, damageTime: e.target.value })}
                className="h-11 border-border/50 focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border/30" />

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Reporter Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportedBy" className="text-sm font-semibold">Reported By *</Label>
              <Input
                id="reportedBy"
                value={formData.reportedBy}
                onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                placeholder="Name of reporter"
                className="h-11 border-border/50 focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo" className="text-sm font-semibold">Contact Information</Label>
              <Input
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder="Phone or email"
                className="h-11 border-border/50 focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border/30" />

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Damage Description</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="damageDescription" className="text-sm font-semibold">Description *</Label>
            <Textarea
              id="damageDescription"
              value={formData.damageDescription}
              onChange={(e) => setFormData({ ...formData, damageDescription: e.target.value })}
              placeholder="Describe the damage in detail..."
              className="min-h-32 border-border/50 focus:ring-2 focus:ring-primary/50 resize-none"
              required
            />
          </div>
        </div>

        <div className="border-t border-border/30" />

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Evidence Images</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" className="relative h-11 font-semibold border-dashed hover:bg-muted" asChild>
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {initialData && !hasNewImages ? "Replace Images" : "Upload Images"}
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </Button>
              <span className="text-sm text-muted-foreground font-medium">
                {formData.images?.length || 0} image(s) selected
              </span>
            </div>

            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group border border-border/50">
                    <img src={preview || "/placeholder.svg"} alt={`Preview ${index + 1}`} className="object-cover w-full h-full group-hover:brightness-75 transition-all" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border/30">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-11 font-semibold">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1 h-11 font-semibold shadow-lg hover:shadow-xl transition-all">
            {isLoading ? "Submitting..." : initialData ? "Update Report" : "Submit Report"}
          </Button>
        </div>
      </form>
    </div>
  );
};
