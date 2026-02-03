import { useState } from 'react';
import { AdminDashboard } from './company-admin/AdminDashboardEnhanced';
import { ApprovalsConsolidated } from './company-admin/ApprovalsConsolidated';
import { ManageConsolidated } from './company-admin/ManageConsolidated';
import { SettingsConsolidated } from './company-admin/SettingsConsolidated';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  Home,
  CheckCircle2,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  ChevronDown,
  Building2,
  X,
  Search,
  ChevronRight,
  ChevronLeft,
  User,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type AdminScreen = 'home' | 'approvals' | 'manage' | 'settings';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'approvals', label: 'Approvals', icon: CheckCircle2, badge: 8 },
  { id: 'manage', label: 'Manage', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function CompanyAdminPortal() {
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'approval', title: 'New Approval Request', message: 'John Doe requested approval for Mumbai to Delhi flight', time: '5 min ago', unread: true },
    { id: 2, type: 'approval', title: 'Expense Claim Pending', message: 'Sarah Wilson submitted expense claim for ₹3,500', time: '15 min ago', unread: true },
    { id: 3, type: 'approval', title: 'Utility Bill Request', message: 'Raghava Boyidi requested utility bill reimbursement', time: '1 hour ago', unread: true },
    { id: 4, type: 'booking', title: 'Booking Completed', message: 'Mike Johnson completed hotel booking for Bangalore', time: '2 hours ago', unread: false },
    { id: 5, type: 'budget', title: 'Budget Alert', message: 'Sales department has used 85% of monthly budget', time: '3 hours ago', unread: false },
  ]);

  const getPageTitle = () => {
    const screen = navItems.find(item => item.id === currentScreen);
    return screen ? screen.label : 'Home';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo Section */}
        <div className="border-b border-gray-200 flex flex-col items-center justify-center px-4 py-4">
          {!sidebarCollapsed ? (
            <div className="flex items-start gap-3 w-full">
              {/* Company Logo */}
              <div className="w-16 h-16 bg-[#4A7C59] rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                <Building2 className="w-9 h-9 text-white" />
              </div>
              
              {/* Company Name & SimplifyMove Branding */}
              <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-base font-bold text-gray-900 leading-tight mb-1.5">
                  <span className="text-gray-900">Acme</span><span className="text-[#4A7C59]">Corporation</span><span className="text-gray-900">.com</span>
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500">Powered By</span>
                  <span className="text-[11px] font-semibold text-gray-800">SimplifyMove</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              {/* Company Logo - Collapsed */}
              <div className="w-10 h-10 bg-[#4A7C59] rounded-xl flex items-center justify-center mx-auto shadow-md">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-2 overflow-y-auto h-[calc(100vh-8rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentScreen(item.id as AdminScreen);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-[#000035] text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge className={`text-xs px-2 ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
          {!sidebarCollapsed && (
            <div className="p-3">
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <div className="w-10 h-10 bg-[#000035] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Acme Corp</p>
                  <p className="text-xs text-gray-600 truncate">Sarah Johnson</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex items-center justify-center w-full py-3 text-gray-600 hover:bg-gray-100 transition-colors border-t border-gray-200"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
            {/* Left Side */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h2>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 min-w-[200px]">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                />
              </div>

              {/* Help */}
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <HelpCircle className="w-5 h-5" />
              </Button>

              {/* Notifications */}
              <button 
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600 hidden md:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <div className="font-semibold">Sarah Johnson</div>
                      <div className="text-xs text-gray-500 font-normal">Admin - Acme Corp</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentScreen('settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Notifications Panel */}
        {showNotifications && (
          <>
            <div 
              className="fixed inset-0 bg-transparent z-40"
              onClick={() => setShowNotifications(false)}
            />
            
            <div className="fixed top-20 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-2xl z-50 max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col border border-gray-200">
              {/* Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-xs text-gray-600">
                  {notifications.filter(n => n.unread).length} unread notifications
                </p>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          notification.unread ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => {
                          setNotifications(notifications.map(n => 
                            n.id === notification.id ? { ...n, unread: false } : n
                          ));
                        }}
                      >
                        <div className="flex gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="font-medium text-sm text-gray-900">
                                {notification.title}
                              </p>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No notifications</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t bg-gray-50">
                  <button
                    onClick={() => {
                      setNotifications(notifications.map(n => ({ ...n, unread: false })));
                    }}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {currentScreen === 'home' && <AdminDashboard onNavigate={(screen) => {
            if (screen === 'finance-claims') setCurrentScreen('approvals');
            else setCurrentScreen('home');
          }} />}
          {currentScreen === 'approvals' && <ApprovalsConsolidated />}
          {currentScreen === 'manage' && <ManageConsolidated />}
          {currentScreen === 'settings' && <SettingsConsolidated />}
        </main>
      </div>
    </div>
  );
}