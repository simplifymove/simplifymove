import { useState } from 'react';
import { EmployeeDashboardClean } from './employee/EmployeeDashboardClean';
import { NewBookingComplete, PrefilledBookingData } from './employee/NewBookingComplete';
import { MyOrdersClean } from './employee/MyOrdersClean';
import { SavedTripsClean, SavedTrip } from './employee/SavedTripsClean';
import { ProfileClean } from './employee/ProfileClean';
import { WalletScreenClean } from './employee/WalletScreenClean';
import { ExpenseClaimsEmployeeClean } from './employee/ExpenseClaimsEmployeeClean';
import { UtilityBillsClean } from './employee/UtilityBillsClean';
import { CourierServicesClean } from './employee/CourierServicesClean';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
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
  Plus, 
  Package, 
  User, 
  Wallet,
  Bookmark,
  Clock,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Receipt,
  Building2,
  ChevronRight,
  Search,
  Globe,
  HelpCircle,
  Truck
} from 'lucide-react';

type EmployeeScreen = 'dashboard' | 'new-booking' | 'my-orders' | 'profile' | 'saved-trips' | 'wallet' | 'expense-claims' | 'utility-bills' | 'courier-services';

const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'new-booking', label: 'Book', icon: Plus },
  { id: 'courier-services', label: 'Courier', icon: Truck },
  { id: 'utility-bills', label: 'Bills', icon: CreditCard },
  { id: 'my-orders', label: 'My Trips', icon: Package },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'expense-claims', label: 'Expenses', icon: Receipt },
];

export function EmployeePortalClean() {
  const [currentScreen, setCurrentScreen] = useState<EmployeeScreen>('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [prefilledBookingData, setPrefilledBookingData] = useState<PrefilledBookingData | undefined>(undefined);

  const handleBookAgain = (trip: SavedTrip) => {
    const serviceMap: { [key: string]: string } = {
      'Flight': 'flight',
      'Cab': 'cab',
      'Hotel': 'hotel',
      'Bus': 'bus',
      'Bike': 'bike'
    };

    const prefillData: PrefilledBookingData = {
      service: serviceMap[trip.type] || 'flight',
      from: trip.from,
      to: trip.to,
      ...trip.bookingDetails
    };

    setPrefilledBookingData(prefillData);
    setCurrentScreen('new-booking');
  };

  const handleNavigation = (screen: EmployeeScreen) => {
    setCurrentScreen(screen);
    setShowMobileMenu(false);
    if (screen !== 'new-booking') {
      setPrefilledBookingData(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Professional Header with #000035 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#000035] rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[#000035]">SimplifyMove</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id as EmployeeScreen)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-[#000035] text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-[#000035]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Become Host / Company Badge */}
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden md:flex text-sm text-gray-700 hover:bg-gray-50"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Company Portal
              </Button>

              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">Rajesh Kumar</p>
                      <p className="text-xs text-gray-500 font-normal">rajesh@company.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation('profile')}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('saved-trips')}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Saved Trips
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('utility-bills')}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Utility Bills
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation('my-orders')}>
                    <Package className="w-4 h-4 mr-2" />
                    My Trips
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('wallet')}>
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
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
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id as EmployeeScreen)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-gray-100 text-gray-900 font-medium' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                
                {/* Divider */}
                <div className="border-t border-gray-200 my-2"></div>
                
                {/* Additional Menu Items */}
                <button
                  onClick={() => handleNavigation('profile')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    currentScreen === 'profile'
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => handleNavigation('saved-trips')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    currentScreen === 'saved-trips'
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                  <span>Saved Trips</span>
                </button>
                <button
                  onClick={() => handleNavigation('utility-bills')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    currentScreen === 'utility-bills'
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Utility Bills</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-gray-50">
        {currentScreen === 'dashboard' && (
          <EmployeeDashboardClean onNavigate={handleNavigation} />
        )}
        {currentScreen === 'new-booking' && (
          <NewBookingComplete prefilledData={prefilledBookingData} />
        )}
        {currentScreen === 'my-orders' && <MyOrdersClean />}
        {currentScreen === 'saved-trips' && (
          <SavedTripsClean onBookAgain={handleBookAgain} />
        )}
        {currentScreen === 'wallet' && <WalletScreenClean />}
        {currentScreen === 'expense-claims' && <ExpenseClaimsEmployeeClean />}
        {currentScreen === 'utility-bills' && <UtilityBillsClean />}
        {currentScreen === 'profile' && <ProfileClean />}
        {currentScreen === 'courier-services' && <CourierServicesClean />}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">SimplifyMove</h3>
              <p className="text-sm text-gray-600">
                Simplifying business travel and logistics for modern enterprises.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-sm">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">About Us</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-sm">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Safety</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-sm">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© 2025 SimplifyMove. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <Globe className="w-4 h-4" />
                English (US)
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                ₹ INR
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}