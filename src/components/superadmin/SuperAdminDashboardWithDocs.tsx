import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Database,
  Shield,
  Zap,
  FileText,
  MessageSquare,
  BarChart3,
  Code,
  ArrowRight,
  Settings,
  Plug,
  AlertCircle
} from 'lucide-react';

// Import all the clean components
import { CompanyManagementClean } from './CompanyManagementClean';
import { SuperAdminUserManagementClean } from './SuperAdminUserManagementClean';
import { GlobalAnalyticsDashboardClean } from './GlobalAnalyticsDashboardClean';
import { PlatformAuditLogsClean } from './PlatformAuditLogsClean';
import { SubscriptionBillingClean } from './SubscriptionBillingClean';
import { SystemConfigurationClean } from './SystemConfigurationClean';
import { VendorIntegrationClean } from './VendorIntegrationClean';
import { SystemHealthMonitoringClean } from './SystemHealthMonitoringClean';
import { GlobalPolicyTemplatesClean } from './GlobalPolicyTemplatesClean';
import { SupportTicketManagementClean } from './SupportTicketManagementClean';
import { PlatformReportsExportClean } from './PlatformReportsExportClean';
import { DevelopmentDocsClean } from './DevelopmentDocsClean';

type SuperAdminFeature = 
  | 'overview'
  | 'companies'
  | 'users'
  | 'analytics'
  | 'audit-logs'
  | 'subscriptions'
  | 'system-config'
  | 'vendors'
  | 'health'
  | 'policies'
  | 'support'
  | 'reports'
  | 'dev-docs';

interface FeatureCard {
  id: SuperAdminFeature;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  stats?: { label: string; value: string | number };
}

const featureCards: FeatureCard[] = [
  {
    id: 'companies',
    title: 'Company Management',
    description: 'Multi-tenant CRUD operations for companies',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    stats: { label: 'Total Companies', value: 5 }
  },
  {
    id: 'users',
    title: 'Super Admin Users',
    description: 'Manage platform administrators and permissions',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    stats: { label: 'Admin Users', value: 6 }
  },
  {
    id: 'analytics',
    title: 'Global Analytics',
    description: 'Platform-wide performance metrics and insights',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    stats: { label: 'Total Revenue', value: '₹43.1L' }
  },
  {
    id: 'audit-logs',
    title: 'Platform Audit Logs',
    description: 'System-wide activity tracking and monitoring',
    icon: FileText,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    stats: { label: 'Total Logs', value: 8 }
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions & Billing',
    description: 'Manage subscriptions, invoices, and payments',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    stats: { label: 'Active Subscriptions', value: 5 }
  },
  {
    id: 'system-config',
    title: 'System Configuration',
    description: 'Global platform settings and parameters',
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    stats: { label: 'Config Sections', value: 6 }
  },
  {
    id: 'vendors',
    title: 'Vendor & Integrations',
    description: 'Third-party services and API integrations',
    icon: Plug,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    stats: { label: 'Active Vendors', value: 5 }
  },
  {
    id: 'health',
    title: 'System Health',
    description: 'Real-time infrastructure monitoring',
    icon: Activity,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    stats: { label: 'Uptime', value: '99.7%' }
  },
  {
    id: 'policies',
    title: 'Global Policy Templates',
    description: 'Reusable policy templates for companies',
    icon: Shield,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    stats: { label: 'Templates', value: 5 }
  },
  {
    id: 'support',
    title: 'Support Tickets',
    description: 'Manage customer support and queries',
    icon: MessageSquare,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    stats: { label: 'Open Tickets', value: 2 }
  },
  {
    id: 'reports',
    title: 'Platform Reports',
    description: 'Generate and export platform data',
    icon: BarChart3,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    stats: { label: 'Report Templates', value: 8 }
  }
];

export function SuperAdminDashboardWithDocs() {
  const [currentFeature, setCurrentFeature] = useState<SuperAdminFeature>('overview');

  // If a specific feature is selected, render that component
  if (currentFeature !== 'overview') {
    return (
      <div>
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200 p-4">
          <Button
            variant="outline"
            onClick={() => setCurrentFeature('overview')}
            className="mb-0"
          >
            ← Back to Dashboard
          </Button>
        </div>

        {/* Render Selected Feature */}
        {currentFeature === 'companies' && <CompanyManagementClean />}
        {currentFeature === 'users' && <SuperAdminUserManagementClean />}
        {currentFeature === 'analytics' && <GlobalAnalyticsDashboardClean />}
        {currentFeature === 'audit-logs' && <PlatformAuditLogsClean />}
        {currentFeature === 'subscriptions' && <SubscriptionBillingClean />}
        {currentFeature === 'system-config' && <SystemConfigurationClean />}
        {currentFeature === 'vendors' && <VendorIntegrationClean />}
        {currentFeature === 'health' && <SystemHealthMonitoringClean />}
        {currentFeature === 'policies' && <GlobalPolicyTemplatesClean />}
        {currentFeature === 'support' && <SupportTicketManagementClean />}
        {currentFeature === 'reports' && <PlatformReportsExportClean />}
        {currentFeature === 'dev-docs' && <DevelopmentDocsClean />}
      </div>
    );
  }

  // Dashboard Overview
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Platform-wide control and management system</p>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Companies</p>
                  <p className="text-3xl font-bold text-gray-900">5</p>
                  <p className="text-xs text-green-600 mt-1">+1 this month</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">505</p>
                  <p className="text-xs text-green-600 mt-1">+15% growth</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Platform Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹43.1L</p>
                  <p className="text-xs text-green-600 mt-1">+23.5% MoM</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">System Health</p>
                  <p className="text-3xl font-bold text-green-600">99.7%</p>
                  <p className="text-xs text-gray-600 mt-1">Uptime</p>
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-7 h-7 text-red-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Platform Management</h2>
          <p className="text-gray-600 mt-1">Access all administrative features and tools</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            
            return (
              <Card
                key={feature.id}
                className="p-6 border-gray-200 hover:shadow-xl transition-all cursor-pointer group hover:scale-105"
                onClick={() => setCurrentFeature(feature.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#000035] transition-colors" />
                </div>

                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>

                {feature.stats && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{feature.stats.label}</span>
                      <span className="font-bold text-gray-900">{feature.stats.value}</span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="p-6 border-gray-200 bg-blue-50">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setCurrentFeature('companies')}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Add New Company
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setCurrentFeature('users')}
              >
                <Users className="w-4 h-4 mr-2" />
                Create Admin User
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setCurrentFeature('reports')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-gray-200 bg-yellow-50">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">System Alerts</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border border-yellow-200">
                <p className="text-sm font-semibold text-gray-900">2 Open Support Tickets</p>
                <p className="text-xs text-gray-600">Requires attention</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-yellow-200">
                <p className="text-sm font-semibold text-gray-900">1 Pending Company Approval</p>
                <p className="text-xs text-gray-600">Awaiting verification</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Feature Completion Status */}
        <Card className="p-6 border-gray-200 mt-8 bg-green-50">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Implementation Status</h3>
              <p className="text-sm text-gray-600">All Super Admin features are fully implemented</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Features Complete</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-sm font-bold text-green-600">11/11</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Progress</p>
              <p className="text-3xl font-bold text-green-600">100%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}