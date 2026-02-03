import { useState } from 'react';
import { EmployeePortalClean } from './components/EmployeePortalClean';
import { CompanyAdminPortal } from './components/CompanyAdminPortal';
import { SuperAdminPortal } from './components/SuperAdminPortal';
import { EmployeeLogin } from './components/auth/EmployeeLogin';
import { CompanyAdminLogin } from './components/auth/CompanyAdminLogin';
import { SuperAdminLogin } from './components/auth/SuperAdminLogin';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { Users, Building2, Shield } from 'lucide-react';

type Portal = 'employee' | 'company-admin' | 'super-admin';

export default function App() {
  const [selectedPortal, setSelectedPortal] = useState<Portal | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSelectPortal = (portal: Portal) => {
    setSelectedPortal(portal);
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleBackToHome = () => {
    setSelectedPortal(null);
    setIsAuthenticated(false);
  };

  // Landing Page
  if (!selectedPortal) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-5xl w-full">
            <div className="text-center mb-12">
              <h1 className="text-[#000035] mb-2">SimplifyMove</h1>
              <p className="text-gray-600">Business Travel & Logistics Management Platform</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => handleSelectPortal('employee')}
                className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all hover:scale-105 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#000035]" />
                </div>
                <h3 className="mb-2 text-[#000035]">Employee Portal</h3>
                <p className="text-gray-600 text-sm">Book trips and manage your orders</p>
              </button>

              <button
                onClick={() => handleSelectPortal('company-admin')}
                className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all hover:scale-105 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-[#000035]" />
                </div>
                <h3 className="mb-2 text-[#000035]">Company Admin</h3>
                <p className="text-gray-600 text-sm">Manage approvals and policies</p>
              </button>

              <button
                onClick={() => handleSelectPortal('super-admin')}
                className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all hover:scale-105 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-[#000035]" />
                </div>
                <h3 className="mb-2 text-[#000035]">Super Admin</h3>
                <p className="text-gray-600 text-sm">Platform-wide control and management</p>
              </button>
            </div>
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  // Login Screens
  if (!isAuthenticated) {
    return (
      <>
        {selectedPortal === 'employee' && (
          <EmployeeLogin onLogin={handleLogin} onBack={handleBackToHome} />
        )}
        {selectedPortal === 'company-admin' && (
          <CompanyAdminLogin onLogin={handleLogin} onBack={handleBackToHome} />
        )}
        {selectedPortal === 'super-admin' && (
          <SuperAdminLogin onLogin={handleLogin} onBack={handleBackToHome} />
        )}
        <Toaster />
      </>
    );
  }

  // Portal Dashboards (After Login)
  return (
    <>
      {selectedPortal === 'employee' && <EmployeePortalClean onBackToHome={handleBackToHome} />}
      {selectedPortal === 'company-admin' && <CompanyAdminPortal onBackToHome={handleBackToHome} />}
      {selectedPortal === 'super-admin' && <SuperAdminPortal onBackToHome={handleBackToHome} />}
      <Toaster />
    </>
  );
}
