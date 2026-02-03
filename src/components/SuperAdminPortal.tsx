import { useState } from 'react';
import { SuperAdminDashboardWithDocs } from './superadmin/SuperAdminDashboardWithDocs';
import { CompanyManagementClean } from './superadmin/CompanyManagementClean';
import { VendorIntegrationClean } from './superadmin/VendorIntegrationClean';
import { SubscriptionBillingClean } from './superadmin/SubscriptionBillingClean';
import { SystemConfigurationClean } from './superadmin/SystemConfigurationClean';
import { PlatformAuditLogsClean } from './superadmin/PlatformAuditLogsClean';
import { SystemHealthMonitoringClean } from './superadmin/SystemHealthMonitoringClean';
import { GlobalPolicyTemplatesClean } from './superadmin/GlobalPolicyTemplatesClean';
import { SupportTicketManagementClean } from './superadmin/SupportTicketManagementClean';
import { PromotionalCampaignsClean } from './superadmin/PromotionalCampaignsClean';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  LayoutDashboard, 
  Building2, 
  Truck, 
  DollarSign, 
  Settings,
  Bell,
  LogOut,
  Menu,
  Shield,
  Zap,
  Activity,
  Package,
  Tag,
  MessageSquare,
  FileText,
  X
} from 'lucide-react';

type SuperAdminScreen = 
  | 'dashboard'
  | 'companies'
  | 'vendors'
  | 'finance'
  | 'settings'
  | 'audit'
  | 'health'
  | 'services'
  | 'campaigns'
  | 'support'
  | 'integrations';

interface SuperAdminPortalProps {
  onBackToHome?: () => void;
}

const menuItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'companies' as const, label: 'Company Management', icon: Building2 },
  { id: 'vendors' as const, label: 'Vendor Management', icon: Truck },
  { id: 'finance' as const, label: 'Finance & Billing', icon: DollarSign },
  { id: 'settings' as const, label: 'System Settings', icon: Settings },
  { id: 'audit' as const, label: 'Audit Logs', icon: Shield },
  { id: 'health' as const, label: 'Platform Health', icon: Activity },
  { id: 'services' as const, label: 'Service Management', icon: Package },
  { id: 'campaigns' as const, label: 'Promotional Campaigns', icon: Tag },
  { id: 'support' as const, label: 'Support Tickets', icon: MessageSquare },
  { id: 'integrations' as const, label: 'Integrations', icon: Zap },
];

export function SuperAdminPortal({ onBackToHome }: SuperAdminPortalProps) {
  const [currentScreen, setCurrentScreen] = useState<SuperAdminScreen>('dashboard');
  const [showMenu, setShowMenu] = useState(false);

  const currentMenuItem = menuItems.find(item => item.id === currentScreen);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-[#000035] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Menu Toggle */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="text-white hover:bg-white/10 lg:hidden"
              >
                {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8" />
                <div>
                  <h1 className="text-xl font-bold">SimplifyMove</h1>
                  <p className="text-xs text-gray-300">Super Admin Portal</p>
                </div>
              </div>
            </div>

            {/* Current Screen Badge - Mobile */}
            <div className="lg:hidden">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                {currentMenuItem?.label}
              </Badge>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-semibold">Super Admin</p>
                      <p className="text-xs text-gray-500">admin@simplifymove.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onBackToHome}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Exit to Home
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] sticky top-16">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#000035] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        {showMenu && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setShowMenu(false)}>
            <aside className="w-72 bg-white h-full" onClick={(e) => e.stopPropagation()}>
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentScreen(item.id);
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#000035] text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-64px)]">
          {currentScreen === 'dashboard' && <SuperAdminDashboardWithDocs />}
          {currentScreen === 'companies' && <CompanyManagementClean />}
          {currentScreen === 'vendors' && <VendorIntegrationClean />}
          {currentScreen === 'finance' && <SubscriptionBillingClean />}
          {currentScreen === 'settings' && <SystemConfigurationClean />}
          {currentScreen === 'audit' && <PlatformAuditLogsClean />}
          {currentScreen === 'health' && <SystemHealthMonitoringClean />}
          {currentScreen === 'services' && <GlobalPolicyTemplatesClean />}
          {currentScreen === 'campaigns' && <PromotionalCampaignsClean />}
          {currentScreen === 'support' && <SupportTicketManagementClean />}
          {currentScreen === 'integrations' && <GlobalPolicyTemplatesClean />}
        </main>
      </div>
    </div>
  );
}