import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Calendar,
  Download,
  Activity,
  BarChart3,
  PieChart,
  Globe,
  Zap
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PlatformMetrics {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  activeUsers: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  userGrowth: number;
  bookingGrowth: number;
}

interface CompanyPerformance {
  companyId: string;
  companyName: string;
  plan: string;
  employees: number;
  bookings: number;
  revenue: number;
  growth: number;
}

interface RevenueByPlan {
  plan: string;
  companies: number;
  revenue: number;
  percentage: number;
}

interface MonthlyTrend {
  month: string;
  companies: number;
  revenue: number;
  bookings: number;
  users: number;
}

const mockMetrics: PlatformMetrics = {
  totalCompanies: 5,
  activeCompanies: 4,
  totalUsers: 505,
  activeUsers: 465,
  totalBookings: 1527,
  totalRevenue: 4310000,
  monthlyRevenue: 370000,
  revenueGrowth: 23.5,
  userGrowth: 15.2,
  bookingGrowth: 18.7,
};

const mockCompanyPerformance: CompanyPerformance[] = [
  { companyId: 'COMP-001', companyName: 'Tech Innovations Ltd', plan: 'Enterprise', employees: 150, bookings: 487, revenue: 1450000, growth: 25.3 },
  { companyId: 'COMP-005', companyName: 'Healthcare Plus', plan: 'Enterprise', employees: 200, bookings: 612, revenue: 1740000, growth: 28.1 },
  { companyId: 'COMP-002', companyName: 'Global Marketing Solutions', plan: 'Pro', employees: 75, bookings: 245, revenue: 680000, growth: 12.5 },
  { companyId: 'COMP-004', companyName: 'Finance Pro Services', plan: 'Pro', employees: 50, bookings: 125, revenue: 425000, growth: -5.2 },
  { companyId: 'COMP-003', companyName: 'Retail Empire Inc', plan: 'Basic', employees: 30, bookings: 58, revenue: 15000, growth: 45.8 },
];

const mockRevenueByPlan: RevenueByPlan[] = [
  { plan: 'Enterprise', companies: 2, revenue: 3190000, percentage: 74 },
  { plan: 'Pro', companies: 2, revenue: 1105000, percentage: 25.6 },
  { plan: 'Basic', companies: 1, revenue: 15000, percentage: 0.4 },
];

const mockMonthlyTrends: MonthlyTrend[] = [
  { month: 'Jul', companies: 3, revenue: 215000, bookings: 185, users: 315 },
  { month: 'Aug', companies: 3, revenue: 245000, bookings: 225, users: 340 },
  { month: 'Sep', companies: 4, revenue: 285000, bookings: 268, users: 385 },
  { month: 'Oct', companies: 4, revenue: 325000, bookings: 312, users: 425 },
  { month: 'Nov', companies: 5, revenue: 348000, bookings: 351, users: 475 },
  { month: 'Dec', companies: 5, revenue: 370000, bookings: 395, users: 505 },
];

export function GlobalAnalyticsDashboardClean() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last_6_months');

  // Export analytics
  const handleExportAnalytics = () => {
    toast.success('Exporting platform analytics...', {
      description: 'Your report will be downloaded shortly',
    });
  };

  // Get plan color
  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'enterprise': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'pro': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'basic': return { bg: 'bg-green-100', text: 'text-green-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Global Analytics</h1>
              <p className="text-gray-600 mt-1">Platform-wide performance metrics and insights</p>
            </div>
            <div className="flex gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                <option value="last_30_days">Last 30 Days</option>
                <option value="last_3_months">Last 3 Months</option>
                <option value="last_6_months">Last 6 Months</option>
                <option value="this_year">This Year</option>
                <option value="all_time">All Time</option>
              </select>
              <Button
                onClick={handleExportAnalytics}
                className="bg-[#000035] hover:bg-[#000055]"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(mockMetrics.totalRevenue / 100000).toFixed(1)}L</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+{mockMetrics.revenueGrowth}%</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Companies</p>
                  <p className="text-3xl font-bold text-gray-900">{mockMetrics.activeCompanies}</p>
                  <p className="text-xs text-gray-600 mt-2">of {mockMetrics.totalCompanies} total</p>
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
                  <p className="text-3xl font-bold text-gray-900">{mockMetrics.totalUsers}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+{mockMetrics.userGrowth}%</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{mockMetrics.totalBookings}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+{mockMetrics.bookingGrowth}%</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="companies" className="data-[state=active]:bg-white">
                Companies
              </TabsTrigger>
              <TabsTrigger value="revenue" className="data-[state=active]:bg-white">
                Revenue
              </TabsTrigger>
              <TabsTrigger value="trends" className="data-[state=active]:bg-white">
                Trends
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 border-gray-200 bg-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Monthly Revenue</h4>
                  <Badge className="bg-blue-600 text-white border-0">Current</Badge>
                </div>
                <p className="text-3xl font-bold text-gray-900">₹{(mockMetrics.monthlyRevenue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-gray-600 mt-1">December 2024</p>
              </Card>

              <Card className="p-6 border-gray-200 bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Active Users</h4>
                  <Badge className="bg-green-600 text-white border-0">{((mockMetrics.activeUsers / mockMetrics.totalUsers) * 100).toFixed(0)}%</Badge>
                </div>
                <p className="text-3xl font-bold text-gray-900">{mockMetrics.activeUsers}</p>
                <p className="text-sm text-gray-600 mt-1">of {mockMetrics.totalUsers} total users</p>
              </Card>

              <Card className="p-6 border-gray-200 bg-purple-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Avg. Booking Value</h4>
                  <Badge className="bg-purple-600 text-white border-0">Live</Badge>
                </div>
                <p className="text-3xl font-bold text-gray-900">₹{Math.round(mockMetrics.totalRevenue / mockMetrics.totalBookings).toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Per booking</p>
              </Card>
            </div>

            {/* Growth Indicators */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Revenue Growth</p>
                    <p className="text-2xl font-bold text-green-600">+{mockMetrics.revenueGrowth}%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Month over month increase</p>
              </Card>

              <Card className="p-6 border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User Growth</p>
                    <p className="text-2xl font-bold text-blue-600">+{mockMetrics.userGrowth}%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">New users this month</p>
              </Card>

              <Card className="p-6 border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Booking Growth</p>
                    <p className="text-2xl font-bold text-orange-600">+{mockMetrics.bookingGrowth}%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Booking volume increase</p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Company Performance</h2>
              <Button variant="outline" onClick={handleExportAnalytics}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {mockCompanyPerformance.map((company, index) => {
              const planColor = getPlanColor(company.plan);

              return (
                <Card key={company.companyId} className="p-6 border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#000035] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-white">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900">{company.companyName}</h3>
                            <Badge variant="outline" className={`${planColor.bg} ${planColor.text} border-0`}>
                              {company.plan}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{company.companyId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">₹{(company.revenue / 1000).toFixed(0)}K</p>
                          <div className="flex items-center gap-1 mt-1">
                            {company.growth > 0 ? (
                              <>
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600">+{company.growth}%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-4 h-4 text-red-600" />
                                <span className="text-sm text-red-600">{company.growth}%</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Employees</p>
                          <p className="text-lg font-bold text-gray-900">{company.employees}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Bookings</p>
                          <p className="text-lg font-bold text-gray-900">{company.bookings}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Avg. per Booking</p>
                          <p className="text-lg font-bold text-gray-900">₹{Math.round(company.revenue / company.bookings).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Revenue Breakdown by Plan</h2>
              <Button variant="outline" onClick={handleExportAnalytics}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {mockRevenueByPlan.map((item) => {
              const planColor = getPlanColor(item.plan);

              return (
                <Card key={item.plan} className="p-6 border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${planColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <PieChart className={`w-7 h-7 ${planColor.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{item.plan} Plan</h3>
                          <p className="text-sm text-gray-600">{item.companies} companies subscribed</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">₹{(item.revenue / 1000).toFixed(0)}K</p>
                          <Badge className={`${planColor.bg} ${planColor.text} border-0 mt-1`}>
                            {item.percentage}% of total
                          </Badge>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                          className={`h-3 rounded-full ${planColor.text.replace('text', 'bg')}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Companies</p>
                          <p className="text-lg font-bold text-gray-900">{item.companies}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Avg. per Company</p>
                          <p className="text-lg font-bold text-gray-900">₹{(item.revenue / item.companies / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Revenue Share</p>
                          <p className="text-lg font-bold text-gray-900">{item.percentage}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Platform Growth Trends</h2>
              <Button variant="outline" onClick={handleExportAnalytics}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Trend Visualization */}
            <Card className="p-6 border-gray-200">
              <h3 className="font-semibold mb-6">Monthly Performance</h3>
              <div className="space-y-6">
                {mockMonthlyTrends.map((trend, index) => (
                  <div key={trend.month}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900 w-12">{trend.month}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {trend.companies} companies
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {trend.users} users
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {trend.bookings} bookings
                          </Badge>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">₹{(trend.revenue / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(trend.companies / 5) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Companies</p>
                      </div>
                      <div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(trend.users / 505) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Users</p>
                      </div>
                      <div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${(trend.bookings / 395) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Bookings</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Growth Metrics */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 border-gray-200 bg-green-50">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Fastest Growing Metric</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">Revenue</p>
                <p className="text-sm text-gray-600 mt-1">72% increase in last 6 months</p>
              </Card>

              <Card className="p-6 border-gray-200 bg-blue-50">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-8 h-8 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Platform Adoption</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">67%</p>
                <p className="text-sm text-gray-600 mt-1">Companies actively using platform</p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}