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
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Disaster Management Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track and manage house damage reports</p>
            </div>
            <Button onClick={() => setShowForm(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              New Report
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Reports"
            value={totalReports}
            icon={Home}
            variant="default"
          />
          <StatsCard
            title="Damage Types"
            value={damageTypes.length}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatsCard
            title="Recent (7 days)"
            value={recentReports}
            icon={Calendar}
            trend={`${recentReports} new this week`}
            variant="info"
          />
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location, description, or reporter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
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
        </Card>

        {/* Houses Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        ) : filteredHouses.length === 0 ? (
          <Card className="p-12 text-center">
            <Home className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reports found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first damage report"}
            </p>
            {!searchTerm && filterType === "all" && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Report
              </Button>
            )}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHouse ? "Edit Damage Report" : "New Damage Report"}</DialogTitle>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Damage Report Details</DialogTitle>
          </DialogHeader>
          {selectedHouse && (
            <div className="space-y-6">
              {selectedHouse.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedHouse.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Damage ${idx + 1}`}
                      className="rounded-lg w-full aspect-video object-cover"
                    />
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{selectedHouse.houseLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-semibold">{selectedHouse.houseSize} Marla</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Damage Type</p>
                  <p className="font-semibold">{selectedHouse.damageType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-semibold">{format(new Date(selectedHouse.damageTime), "PPP p")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reported By</p>
                  <p className="font-semibold">{selectedHouse.reportedBy}</p>
                </div>
                {selectedHouse.contactInfo && (
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-semibold">{selectedHouse.contactInfo}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-foreground">{selectedHouse.damageDescription}</p>
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
