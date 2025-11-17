'use client';

import { Bell, Search, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const TopBar = ({ onAddClick }: { onAddClick: () => void }) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-8 z-40">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-10 h-10 bg-muted border-0 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={onAddClick} className="font-semibold">
          New Report
        </Button>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <User className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};
