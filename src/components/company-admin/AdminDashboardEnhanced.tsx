import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Wallet, 
  ArrowRight,
  Users,
  Plane,
  Truck,
  AlertCircle,
  Clock,
  Calendar,
  TrendingDown,
  Activity,
  Package
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Props {
  onNavigate: (screen: 'dashboard' | 'approvals' | 'employees' | 'wallet' | 'analytics' | 'policy-budget' | 'settings') => void;
}

const monthlySpendData = [
  { name: 'Jan', travel: 24000, logistics: 18000 },
  { name: 'Feb', travel: 28000, logistics: 20000 },
  { name: 'Mar', travel: 32000, logistics: 22000 },
  { name: 'Apr', travel: 29000, logistics: 24000 },
  { name: 'May', travel: 35000, logistics: 26000 },
  { name: 'Jun', travel: 31000, logistics: 23000 },
];

const serviceTypeData = [
  { name: 'Flight', value: 45000, color: '#3b82f6' },
  { name: 'Hotel', value: 28000, color: '#f59e0b' },
  { name: 'Bus', value: 12000, color: '#8b5cf6' },
  { name: 'Cab', value: 15000, color: '#10b981' },
  { name: 'Truck', value: 25000, color: '#ef4444' },
  { name: 'Others', value: 8000, color: '#6b7280' },
];

const pendingApprovals = [
  { 
    id: 'APR2XNVK8EJFG', 
    user: 'John Doe',
    department: 'Sales',
    service: 'Flight', 
    cost: 42500,
    reason: 'Client Meeting - Annual Business Review',
    priority: 'high',
    requestDate: '2025-12-19',
    icon: Plane
  },
  { 
    id: 'APRHK45M9PLQW', 
    user: 'Jane Smith',
    department: 'Operations',
    service: 'Truck', 
    cost: 4500,
    reason: 'Emergency Delivery',
    priority: 'urgent',
    requestDate: '2025-12-18',
    icon: Truck
  },
  { 
    id: 'APRDF89P3QRST', 
    user: 'Mike Johnson',
    department: 'Marketing',
    service: 'Hotel', 
    cost: 15000,
    reason: 'Training Program',
    priority: 'medium',
    requestDate: '2025-12-18',
    icon: Package
  },
];

const recentActivity = [
  { user: 'Sarah Williams', action: 'Completed Truck booking', time: '10 mins ago', type: 'completed' },
  { user: 'Tom Brown', action: 'Submitted approval request', time: '25 mins ago', type: 'pending' },
  { user: 'Alice Cooper', action: 'Added to Business Wallet', amount: '₹5,000', time: '1 hour ago', type: 'wallet' },
  { user: 'Bob Martin', action: 'Flight booking cancelled', time: '2 hours ago', type: 'cancelled' },
];

export function AdminDashboard({ onNavigate }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="mb-2">Welcome back, Sarah! 👋</h1>
            <p className="text-gray-600">Here's what's happening with your company today</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-blue-700 mb-1 font-medium">Monthly Spend</div>
              <div className="text-3xl text-blue-900 mb-2">₹1,33,000</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-blue-700">from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-green-700 mb-1 font-medium">Policy Compliance</div>
              <div className="text-3xl text-green-900 mb-2">94.5%</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-green-600 font-medium">+2.3%</span>
                <span className="text-green-700">improvement</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-orange-700 mb-1 font-medium">Pending Approvals</div>
              <div className="text-3xl text-orange-900 mb-2">5</div>
              <div className="flex items-center gap-1 text-xs">
                <AlertCircle className="w-3 h-3 text-orange-600" />
                <span className="text-orange-600 font-medium">Requires attention</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <Button 
            size="sm" 
            className="w-full mt-2 bg-orange-600 hover:bg-orange-700"
            onClick={() => onNavigate('approvals')}
          >
            Review Now
          </Button>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-purple-700 mb-1 font-medium">Corporate Wallet</div>
              <div className="text-3xl text-purple-900 mb-2">₹3,05,480</div>
              <div className="flex items-center gap-1 text-xs">
                <Activity className="w-3 h-3 text-purple-600" />
                <span className="text-purple-700">Available balance</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly Spend Trend */}
        <div className="lg:col-span-2">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="mb-1">Monthly Spend Trend</h3>
                <p className="text-sm text-gray-600">Travel & Logistics breakdown</p>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySpendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value) => `₹${value}`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="travel" fill="#3b82f6" name="Travel" radius={[8, 8, 0, 0]} />
                <Bar dataKey="logistics" fill="#8b5cf6" name="Logistics" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Service Type Distribution */}
        <div>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <h3 className="mb-1">Service Distribution</h3>
              <p className="text-sm text-gray-600">Current month breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {serviceTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <div className="text-xs text-gray-600">{item.name}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Approvals Queue */}
        <div className="lg:col-span-2">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="mb-1">Pending Approvals</h3>
                <p className="text-sm text-gray-600">Requests awaiting your review</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onNavigate('approvals')}
                className="text-blue-600 hover:text-blue-700"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {pendingApprovals.map((request) => {
                const ServiceIcon = request.icon;
                return (
                  <div
                    key={request.id}
                    className="border-2 rounded-xl p-4 hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer"
                    onClick={() => onNavigate('approvals')}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ServiceIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-gray-900">{request.user}</div>
                            <div className="text-sm text-gray-600">{request.department} • {request.service}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-blue-600">₹{request.cost.toLocaleString()}</div>
                            <Badge 
                              className={`text-xs ${
                                request.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                request.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {request.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">{request.reason}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Requested on {new Date(request.requestDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <h3 className="mb-1">Recent Activity</h3>
              <p className="text-sm text-gray-600">Latest updates</p>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'completed' ? 'bg-green-500' :
                    activity.type === 'pending' ? 'bg-orange-500' :
                    activity.type === 'wallet' ? 'bg-purple-500' :
                    'bg-red-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 font-medium">{activity.user}</div>
                    <div className="text-sm text-gray-600">{activity.action}</div>
                    {activity.amount && (
                      <div className="text-sm font-semibold text-purple-600 mt-1">{activity.amount}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4">
              View All Activity
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
