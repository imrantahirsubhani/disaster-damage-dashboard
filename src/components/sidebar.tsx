'use client';

import { Building2, Activity, Users, Settings, FileText, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '#', active: true },
  { icon: FileText, label: 'Reports', href: '#' },
  { icon: Users, label: 'Recipients', href: '#' },
  { icon: Activity, label: 'Activity', href: '#' },
  { icon: Settings, label: 'Settings', href: '#' },
];

export const Sidebar = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { logout } = useAuth(); // Use logout from AuthContext

  // Function to log out and navigate to login page
 const handleLogout = () => {
    logout();           // ✅ Updates isAuthenticated to false
    navigate('/login'); // ✅ Redirect to login
  };


  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-base text-foreground">Relief Portal</h1>
            <p className="text-xs text-muted-foreground">Damage Tracking</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200',
              item.active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-border">
        <div className="px-4 py-3 rounded-lg bg-muted/50">
          <p className="text-xs font-medium text-muted-foreground">System Status</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-foreground font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Log out button */}
      <button
        onClick={handleLogout}
        className="w-full mt-4 py-2.5 text-sm font-medium text-center text-red-600 hover:bg-red-100 rounded-lg"
      >
        Log Out
      </button>
    </aside>
  );
};
