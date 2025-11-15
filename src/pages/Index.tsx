import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { housesApi, House, CreateHouseData } from "@/lib/api";
import { StatsCard } from "@/components/StatsCard";
import { HouseCard } from "@/components/HouseCard";
import { HouseForm } from "@/components/HouseForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Home, AlertTriangle, Calendar, Plus, Search, Filter } from "lucide-react";
import { format } from "date-fns";

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Fetch houses
  const { data: houses = [], isLoading } = useQuery({
    queryKey: ['houses'],
    queryFn: housesApi.getAll,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: housesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['houses'] });
      setShowForm(false);
      toast({ title: "Success", description: "Damage report submitted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit report", variant: "destructive" });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateHouseData> }) =>
      housesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['houses'] });
      setEditingHouse(null);
      toast({ title: "Success", description: "Report updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update report", variant: "destructive" });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: housesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['houses'] });
      setDeleteId(null);
      toast({ title: "Success", description: "Report deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete report", variant: "destructive" });
    },
  });

  // Filter houses
  const filteredHouses = houses.filter((house) => {
    const matchesSearch = house.houseLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         house.damageDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         house.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || house.damageType.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const totalReports = houses.length;
  const damageTypes = [...new Set(houses.map(h => h.damageType))];
  const recentReports = houses.filter(h => {
    const reportDate = new Date(h.damageTime);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return reportDate >= weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                <AlertTriangle className="h-7 w-7" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Disaster Relief Dashboard
                </h1>
                <p className="text-sm text-muted-foreground font-medium">House Damage Tracking & Management</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} size="lg" className="shadow-lg font-semibold">
              <Plus className="h-5 w-5 mr-2" />
              Report Damage
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Reports"
            value={totalReports}
            icon={Home}
            trend={`${recentReports} new this week`}
            variant="default"
          />
          <StatsCard
            title="Damage Types"
            value={damageTypes.length}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatsCard
            title="Recent Reports"
            value={recentReports}
            icon={Calendar}
            trend="Last 7 days"
            variant="info"
          />
        </div>

        {/* Filters */}
        <Card className="p-6 border-border shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by location, description, or reporter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base border-border focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[200px] h-12 border-border font-medium">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="storm">Storm</SelectItem>
                  <SelectItem value="earthquake">Earthquake</SelectItem>
                  <SelectItem value="flood">Flood</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground font-medium">
            Showing {filteredHouses.length} of {totalReports} reports
          </div>
        </Card>

        {/* Houses Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-medium">Loading reports...</p>
          </div>
        ) : filteredHouses.length === 0 ? (
          <Card className="p-16 text-center border-border shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="bg-muted/50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Home className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No reports found</h3>
              <p className="text-muted-foreground mb-6 text-base">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start by reporting your first damage case to track and manage disaster relief efforts"}
              </p>
              {!searchTerm && filterType === "all" && (
                <Button onClick={() => setShowForm(true)} size="lg" className="font-semibold">
                  <Plus className="h-5 w-5 mr-2" />
                  Report First Damage
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHouses.map((house) => (
              <HouseCard
                key={house._id}
                house={house}
                onView={(id) => setSelectedHouse(houses.find(h => h._id === id) || null)}
                onEdit={(id) => setEditingHouse(houses.find(h => h._id === id) || null)}
                onDelete={setDeleteId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Form Dialog */}
      <Dialog open={showForm || !!editingHouse} onOpenChange={(open) => {
        if (!open) {
          setShowForm(false);
          setEditingHouse(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden border-border shadow-2xl">
          <DialogHeader className="pb-4 border-b border-border">
            <DialogTitle className="text-2xl font-bold">
              {editingHouse ? "Edit Damage Report" : "New Damage Report"}
            </DialogTitle>
          </DialogHeader>
          <HouseForm
            initialData={editingHouse ? {
              ...editingHouse,
              existingImages: editingHouse.images,
            } : undefined}
            onSubmit={(data) => {
              if (editingHouse) {
                updateMutation.mutate({ id: editingHouse._id, data });
              } else {
                createMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingHouse(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!selectedHouse} onOpenChange={(open) => !open && setSelectedHouse(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-border shadow-2xl">
          <DialogHeader className="pb-4 border-b border-border">
            <DialogTitle className="text-2xl font-bold">Damage Report Details</DialogTitle>
          </DialogHeader>
          {selectedHouse && (
            <div className="space-y-8 pt-4">
              {selectedHouse.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedHouse.images.map((img, idx) => (
                    <div key={idx} className="relative overflow-hidden rounded-xl border border-border shadow-lg group">
                      <img
                        src={img}
                        alt={`Damage ${idx + 1}`}
                        className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
                        Image {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-5 border-border bg-muted/30">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Location</p>
                  <p className="font-bold text-lg">{selectedHouse.houseLocation}</p>
                </Card>
                <Card className="p-5 border-border bg-muted/30">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Size</p>
                  <p className="font-bold text-lg">{selectedHouse.houseSize} Marla</p>
                </Card>
                <Card className="p-5 border-border bg-muted/30">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Damage Type</p>
                  <p className="font-bold text-lg capitalize">{selectedHouse.damageType}</p>
                </Card>
                <Card className="p-5 border-border bg-muted/30">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Reported On</p>
                  <p className="font-bold text-lg">{format(new Date(selectedHouse.damageTime), "PPP")}</p>
                </Card>
              </div>
              <Card className="p-6 border-border bg-muted/30">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Description</p>
                <p className="text-foreground leading-relaxed text-base">{selectedHouse.damageDescription}</p>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-5 border-border bg-muted/30">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Reported By</p>
                  <p className="font-bold text-lg">{selectedHouse.reportedBy}</p>
                </Card>
                {selectedHouse.contactInfo && (
                  <Card className="p-5 border-border bg-muted/30">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Contact</p>
                    <p className="font-bold text-lg">{selectedHouse.contactInfo}</p>
                  </Card>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this damage report? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
