import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Package,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Users,
  IndianRupee,
  Calendar,
  MapPin,
  FileText,
  Eye,
  BarChart3,
  PackageCheck
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CourierShipment {
  id: string;
  trackingNumber: string;
  employee: string;
  department: string;
  serviceType: string;
  packageType: string;
  from: string;
  to: string;
  weight: number;
  cost: number;
  status: 'pending' | 'picked-up' | 'in-transit' | 'delivered' | 'cancelled';
  pickupDate: string;
  deliveryDate?: string;
  createdAt: string;
}

const mockShipments: CourierShipment[] = [
  {
    id: '1',
    trackingNumber: 'SM-COU-2024-001',
    employee: 'Raghava Boyidi',
    department: 'Sales',
    serviceType: 'Express Delivery',
    packageType: 'Small Package',
    from: 'Bangalore',
    to: 'Chennai',
    weight: 1.5,
    cost: 120,
    status: 'in-transit',
    pickupDate: '2024-12-29',
    createdAt: '2024-12-28'
  },
  {
    id: '2',
    trackingNumber: 'SM-COU-2024-002',
    employee: 'John Doe',
    department: 'Marketing',
    serviceType: 'Standard Delivery',
    packageType: 'Medium Package',
    from: 'Mumbai',
    to: 'Delhi',
    weight: 5,
    cost: 95,
    status: 'delivered',
    pickupDate: '2024-12-27',
    deliveryDate: '2024-12-28',
    createdAt: '2024-12-26'
  },
  {
    id: '3',
    trackingNumber: 'SM-COU-2024-003',
    employee: 'Sarah Wilson',
    department: 'Operations',
    serviceType: 'Document Courier',
    packageType: 'Envelope',
    from: 'Kolkata',
    to: 'Bangalore',
    weight: 0.3,
    cost: 45,
    status: 'picked-up',
    pickupDate: '2024-12-29',
    createdAt: '2024-12-29'
  },
  {
    id: '4',
    trackingNumber: 'SM-COU-2024-004',
    employee: 'Mike Johnson',
    department: 'IT',
    serviceType: 'Economy Delivery',
    packageType: 'Large Package',
    from: 'Pune',
    to: 'Hyderabad',
    weight: 12,
    cost: 180,
    status: 'pending',
    pickupDate: '2024-12-30',
    createdAt: '2024-12-29'
  }
];

export function CourierManagementClean() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [shipments] = useState<CourierShipment[]>(mockShipments);

  // Calculate statistics
  const stats = {
    total: shipments.length,
    pending: shipments.filter(s => s.status === 'pending').length,
    inTransit: shipments.filter(s => s.status === 'in-transit' || s.status === 'picked-up').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    totalCost: shipments.reduce((sum, s) => sum + s.cost, 0),
    avgCost: Math.round(shipments.reduce((sum, s) => sum + s.cost, 0) / shipments.length)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'picked-up':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.to.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    toast.success('Courier report exported successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Courier Management</h1>
        <p className="text-gray-600 mt-1">Manage and track all company courier shipments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inTransit}</p>
              <p className="text-xs text-gray-500 mt-1">Active shipments</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              <p className="text-xs text-green-600 mt-1">Success rate: 98%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Cost</p>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-5 h-5 text-gray-900" />
                <p className="text-2xl font-bold text-gray-900">{stats.totalCost.toLocaleString()}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Avg: ₹{stats.avgCost}/shipment</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-6 border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by tracking number, employee, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000035]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="picked-up">Picked Up</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Shipments Table */}
      <Card className="border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{shipment.trackingNumber}</p>
                      <p className="text-sm text-gray-500">{shipment.pickupDate}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{shipment.employee}</p>
                      <p className="text-sm text-gray-500">{shipment.department}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">{shipment.from}</p>
                        <p className="text-xs text-gray-500">to {shipment.to}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{shipment.serviceType}</p>
                      <p className="text-xs text-gray-500">{shipment.packageType} ({shipment.weight}kg)</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(shipment.status)}>
                      {shipment.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-semibold text-gray-900">
                      <IndianRupee className="w-4 h-4" />
                      {shipment.cost}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#000035] hover:bg-[#000035] hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredShipments.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No shipments found</p>
          </div>
        )}
      </Card>

      {/* Department Breakdown */}
      <Card className="p-6 border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Department-wise Usage</h2>
        <div className="space-y-4">
          {['Sales', 'Marketing', 'Operations', 'IT'].map((dept) => {
            const deptShipments = shipments.filter(s => s.department === dept);
            const deptCost = deptShipments.reduce((sum, s) => sum + s.cost, 0);
            const percentage = (deptShipments.length / shipments.length) * 100;

            return (
              <div key={dept}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{dept}</p>
                      <p className="text-sm text-gray-500">{deptShipments.length} shipments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 font-semibold text-gray-900">
                      <IndianRupee className="w-4 h-4" />
                      {deptCost}
                    </div>
                    <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#000035] h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
