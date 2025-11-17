'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { housesApi, House, CreateHouseData } from "@/lib/api";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { StatsCard } from "@/components/StatsCard";
import { HouseCard } from "@/components/HouseCard";
import { HouseForm } from "@/components/HouseForm";
import { ProfessionalDialog } from "@/components/professional-dialog"; // Fix import path for professional-dialog component
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import { format } from "date-fns";
import { DetailSection } from "@/components/detail-section";
import { DetailGrid } from "@/components/detail-grid";
import { DetailItem } from "@/components/detail-item";

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const { data: houses = [], isLoading } = useQuery({
    queryKey: ['houses'],
    queryFn: housesApi.getAll,
  });

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

  const filteredHouses = houses.filter((house) => {
    const matchesFilter = filterType === "all" || house.damageType.toLowerCase() === filterType.toLowerCase();
    return matchesFilter;
  });

  const totalReports = houses.length;
  const severeDamage = houses.filter(h => 
    ['earthquake', 'flood', 'fire'].includes(h.damageType.toLowerCase())
  ).length;
  const recentReports = houses.filter(h => {
    const reportDate = new Date(h.damageTime);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return reportDate >= weekAgo;
  }).length;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        <TopBar onAddClick={() => setShowForm(true)} />

        <main className="flex-1 overflow-y-auto pt-20 pb-8 px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track and manage disaster relief operations</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Reports"
                value={totalReports}
                icon={Building2}
                trend={`${recentReports} new this week`}
                variant="default"
              />
              <StatsCard
                title="Severe Damage"
                value={severeDamage}
                icon={AlertTriangle}
                trend="Requires priority"
                variant="warning"
              />
              <StatsCard
                title="Recovery Rate"
                value={`${Math.round((totalReports > 0 ? (recentReports / totalReports) * 100 : 0))}%`}
                icon={TrendingUp}
                trend="Last 7 days"
                variant="success"
              />
            </div>

            {/* Filter section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Filter by damage type:</span>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48 h-10 text-sm">
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

            {/* Reports grid */}
            {isLoading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary" />
                </div>
                <p className="text-muted-foreground mt-4">Loading reports...</p>
              </div>
            ) : filteredHouses.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-lg border border-border">
                <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No reports found</h3>
                <p className="text-muted-foreground">Create your first damage report to get started</p>
              </div>
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
        </main>
      </div>

      <ProfessionalDialog
        open={showForm || !!editingHouse}
        onOpenChange={(open) => {
          if (!open) {
            setShowForm(false);
            setEditingHouse(null);
          }
        }}
        title={editingHouse ? "Edit Damage Report" : "New Damage Report"}
        size="xl"
      >
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
      </ProfessionalDialog>

      <ProfessionalDialog
        open={!!selectedHouse}
        onOpenChange={(open) => !open && setSelectedHouse(null)}
        title="Damage Report Details"
        size="2xl"
      >
        {selectedHouse && (
          <div className="space-y-6">
            {/* Evidence Images Section */}
            {selectedHouse.images.length > 0 && (
              <DetailSection title="Evidence Images">
                <div className="grid grid-cols-2 gap-4">
                  {selectedHouse.images.map((img, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden border border-border/50 aspect-video bg-muted">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Damage ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}

            {/* Property Details Section */}
            <DetailSection title="Property Details">
              <DetailGrid cols={2}>
                <DetailItem label="Location" value={selectedHouse.houseLocation} />
                <DetailItem label="Size" value={`${selectedHouse.houseSize} Marla`} />
                <DetailItem label="Damage Type" value={selectedHouse.damageType} />
                <DetailItem label="Reported Date" value={format(new Date(selectedHouse.damageTime), "PPP")} />
              </DetailGrid>
            </DetailSection>

            {/* Description Section */}
            <DetailSection title="Damage Description">
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{selectedHouse.damageDescription}</p>
              </div>
            </DetailSection>

            {/* Reporter Information Section */}
            <DetailSection title="Reporter Information">
              <DetailGrid cols={2}>
                <DetailItem label="Reported By" value={selectedHouse.reportedBy} />
                {selectedHouse.contactInfo && (
                  <DetailItem label="Contact" value={selectedHouse.contactInfo} />
                )}
              </DetailGrid>
            </DetailSection>
          </div>
        )}
      </ProfessionalDialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-xl">
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
