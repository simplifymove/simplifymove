import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Zap,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SystemMetric {
  id: string;
  name: string;
  category: 'server' | 'database' | 'network' | 'storage' | 'performance';
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  unit: string;
  threshold: number;
  lastUpdated: string;
}

interface ServiceStatus {
  id: string;
  name: string;
  type: 'api' | 'database' | 'cache' | 'queue' | 'storage' | 'cdn';
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  responseTime: number;
  lastCheck: string;
  incidents: number;
}

interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  service: string;
  timestamp: string;
  resolved: boolean;
}

const mockMetrics: SystemMetric[] = [
  {
    id: 'METRIC-001',
    name: 'CPU Usage',
    category: 'server',
    status: 'healthy',
    value: 45,
    unit: '%',
    threshold: 80,
    lastUpdated: '2024-12-24 11:45 AM',
  },
  {
    id: 'METRIC-002',
    name: 'Memory Usage',
    category: 'server',
    status: 'warning',
    value: 72,
    unit: '%',
    threshold: 70,
    lastUpdated: '2024-12-24 11:45 AM',
  },
  {
    id: 'METRIC-003',
    name: 'Disk Usage',
    category: 'storage',
    status: 'healthy',
    value: 58,
    unit: '%',
    threshold: 90,
    lastUpdated: '2024-12-24 11:45 AM',
  },
  {
    id: 'METRIC-004',
    name: 'Database Connections',
    category: 'database',
    status: 'healthy',
    value: 145,
    unit: 'connections',
    threshold: 500,
    lastUpdated: '2024-12-24 11:45 AM',
  },
  {
    id: 'METRIC-005',
    name: 'Network Latency',
    category: 'network',
    status: 'healthy',
    value: 28,
    unit: 'ms',
    threshold: 100,
    lastUpdated: '2024-12-24 11:45 AM',
  },
  {
    id: 'METRIC-006',
    name: 'API Response Time',
    category: 'performance',
    status: 'healthy',
    value: 156,
    unit: 'ms',
    threshold: 500,
    lastUpdated: '2024-12-24 11:45 AM',
  },
  {
    id: 'METRIC-007',
    name: 'Request Rate',
    category: 'performance',
    status: 'healthy',
    value: 1247,
    unit: 'req/min',
    threshold: 5000,
    lastUpdated: '2024-12-24 11:45 AM',
  },
  {
    id: 'METRIC-008',
    name: 'Error Rate',
    category: 'performance',
    status: 'healthy',
    value: 0.3,
    unit: '%',
    threshold: 5,
    lastUpdated: '2024-12-24 11:45 AM',
  },
];

const mockServices: ServiceStatus[] = [
  {
    id: 'SVC-001',
    name: 'Main API Server',
    type: 'api',
    status: 'operational',
    uptime: 99.98,
    responseTime: 156,
    lastCheck: '2024-12-24 11:45 AM',
    incidents: 0,
  },
  {
    id: 'SVC-002',
    name: 'PostgreSQL Database',
    type: 'database',
    status: 'operational',
    uptime: 99.95,
    responseTime: 12,
    lastCheck: '2024-12-24 11:45 AM',
    incidents: 1,
  },
  {
    id: 'SVC-003',
    name: 'Redis Cache',
    type: 'cache',
    status: 'operational',
    uptime: 99.99,
    responseTime: 3,
    lastCheck: '2024-12-24 11:45 AM',
    incidents: 0,
  },
  {
    id: 'SVC-004',
    name: 'Message Queue',
    type: 'queue',
    status: 'degraded',
    uptime: 98.5,
    responseTime: 245,
    lastCheck: '2024-12-24 11:45 AM',
    incidents: 3,
  },
  {
    id: 'SVC-005',
    name: 'File Storage (S3)',
    type: 'storage',
    status: 'operational',
    uptime: 100,
    responseTime: 89,
    lastCheck: '2024-12-24 11:45 AM',
    incidents: 0,
  },
  {
    id: 'SVC-006',
    name: 'CDN Network',
    type: 'cdn',
    status: 'operational',
    uptime: 99.97,
    responseTime: 45,
    lastCheck: '2024-12-24 11:45 AM',
    incidents: 0,
  },
];

const mockAlerts: Alert[] = [
  {
    id: 'ALERT-001',
    severity: 'warning',
    title: 'High Memory Usage',
    description: 'Server memory usage exceeded 70% threshold',
    service: 'Main API Server',
    timestamp: '2024-12-24 11:30 AM',
    resolved: false,
  },
  {
    id: 'ALERT-002',
    severity: 'warning',
    title: 'Message Queue Degraded',
    description: 'Message processing experiencing delays',
    service: 'Message Queue',
    timestamp: '2024-12-24 10:15 AM',
    resolved: false,
  },
  {
    id: 'ALERT-003',
    severity: 'info',
    title: 'Scheduled Maintenance',
    description: 'Database backup completed successfully',
    service: 'PostgreSQL Database',
    timestamp: '2024-12-24 02:00 AM',
    resolved: true,
  },
  {
    id: 'ALERT-004',
    severity: 'critical',
    title: 'High Error Rate',
    description: 'API error rate spiked to 8%',
    service: 'Main API Server',
    timestamp: '2024-12-23 06:45 PM',
    resolved: true,
  },
];

export function SystemHealthMonitoringClean() {
  const [metrics, setMetrics] = useState<SystemMetric[]>(mockMetrics);
  const [services, setServices] = useState<ServiceStatus[]>(mockServices);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return { bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-50 text-green-700 border-green-200' };
      case 'warning':
      case 'degraded':
        return { bg: 'bg-yellow-100', text: 'text-yellow-600', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
      case 'critical':
      case 'outage':
        return { bg: 'bg-red-100', text: 'text-red-600', badge: 'bg-red-50 text-red-700 border-red-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'warning': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'server': return Cpu;
      case 'database': return Database;
      case 'network': return Wifi;
      case 'storage': return HardDrive;
      case 'performance': return Zap;
      default: return Activity;
    }
  };

  // Get service icon
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'api': return Server;
      case 'database': return Database;
      case 'cache': return Zap;
      case 'queue': return Activity;
      case 'storage': return HardDrive;
      case 'cdn': return Wifi;
      default: return Server;
    }
  };

  // Refresh data
  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.success('Refreshing system metrics...');
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('System data refreshed successfully');
    }, 2000);
  };

  // Export report
  const handleExportReport = () => {
    toast.success('Exporting system health report...', {
      description: 'Your report will be downloaded shortly',
    });
  };

  // Resolve alert
  const handleResolveAlert = (alert: Alert) => {
    setAlerts(alerts.map(a => a.id === alert.id ? { ...a, resolved: true } : a));
    toast.success('Alert marked as resolved');
  };

  const healthyMetrics = metrics.filter(m => m.status === 'healthy').length;
  const warningMetrics = metrics.filter(m => m.status === 'warning').length;
  const criticalMetrics = metrics.filter(m => m.status === 'critical').length;
  const operationalServices = services.filter(s => s.status === 'operational').length;
  const activeAlerts = alerts.filter(a => !a.resolved).length;
  const avgUptime = services.reduce((sum, s) => sum + s.uptime, 0) / services.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Health & Monitoring</h1>
              <p className="text-gray-600 mt-1">Real-time platform infrastructure monitoring</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleExportReport}
                className="bg-[#000035] hover:bg-[#000055]"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Overall Status */}
          <Card className="p-6 border-gray-200 mb-6 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">All Systems Operational</h2>
                  <p className="text-gray-600">Platform is running smoothly with {avgUptime.toFixed(2)}% average uptime</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-semibold text-gray-900">2024-12-24 11:45 AM</p>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Healthy Metrics</p>
                  <p className="text-3xl font-bold text-green-600">{healthyMetrics}</p>
                  <p className="text-xs text-gray-600 mt-2">of {metrics.length} total</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Services</p>
                  <p className="text-3xl font-bold text-blue-600">{operationalServices}</p>
                  <p className="text-xs text-gray-600 mt-2">of {services.length} total</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Server className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Alerts</p>
                  <p className="text-3xl font-bold text-yellow-600">{activeAlerts}</p>
                  <p className="text-xs text-gray-600 mt-2">{warningMetrics} warnings</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Uptime</p>
                  <p className="text-3xl font-bold text-purple-600">{avgUptime.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600 mt-2">Last 30 days</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-purple-600" />
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
              <TabsTrigger value="metrics" className="data-[state=active]:bg-white">
                Metrics ({metrics.length})
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-white">
                Services ({services.length})
              </TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-white">
                Alerts ({activeAlerts})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* System Overview */}
            <Card className="p-6 border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">System Status Overview</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Metrics by Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-900">Healthy</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">{healthyMetrics}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium text-gray-900">Warning</span>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">{warningMetrics}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-gray-900">Critical</span>
                      </div>
                      <span className="text-lg font-bold text-red-600">{criticalMetrics}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Service Health</h3>
                  <div className="space-y-3">
                    {services.slice(0, 3).map(service => {
                      const statusColor = getStatusColor(service.status);
                      return (
                        <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{service.name}</p>
                            <p className="text-xs text-gray-600">{service.uptime}% uptime</p>
                          </div>
                          <Badge variant="outline" className={statusColor.badge}>
                            {service.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Alerts */}
            {activeAlerts > 0 && (
              <Card className="p-6 border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Alerts</h2>
                <div className="space-y-3">
                  {alerts.filter(a => !a.resolved).slice(0, 3).map(alert => (
                    <div key={alert.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <span className="text-sm text-gray-600">{alert.timestamp}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{alert.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                          <p className="text-xs text-gray-500">Service: {alert.service}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveAlert(alert)}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-4">
            {metrics.map(metric => {
              const statusColor = getStatusColor(metric.status);
              const CategoryIcon = getCategoryIcon(metric.category);
              const percentage = (metric.value / metric.threshold) * 100;

              return (
                <Card key={metric.id} className="p-6 border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${statusColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <CategoryIcon className={`w-7 h-7 ${statusColor.text}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900">{metric.name}</h3>
                            <Badge variant="outline" className={statusColor.badge}>
                              {metric.status}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                              {metric.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Last updated: {metric.lastUpdated}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-gray-900">
                            {metric.value}{metric.unit === '%' ? '%' : ''}
                          </p>
                          <p className="text-sm text-gray-600">
                            {metric.unit !== '%' && metric.unit}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Usage</span>
                          <span className="text-gray-600">Threshold: {metric.threshold}{metric.unit === '%' ? '%' : ` ${metric.unit}`}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              metric.status === 'healthy' ? 'bg-green-600' :
                              metric.status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4">
            {services.map(service => {
              const statusColor = getStatusColor(service.status);
              const ServiceIcon = getServiceIcon(service.type);

              return (
                <Card key={service.id} className="p-6 border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${statusColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <ServiceIcon className={`w-7 h-7 ${statusColor.text}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900">{service.name}</h3>
                            <Badge variant="outline" className={statusColor.badge}>
                              {service.status}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                              {service.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Last check: {service.lastCheck}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Uptime</p>
                          <p className="text-lg font-bold text-gray-900">{service.uptime}%</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Response Time</p>
                          <p className="text-lg font-bold text-gray-900">{service.responseTime}ms</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Incidents</p>
                          <p className="text-lg font-bold text-gray-900">{service.incidents}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Status</p>
                          <p className="text-sm font-bold text-gray-900">{service.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.map(alert => (
              <Card key={alert.id} className={`p-6 border-gray-200 hover:shadow-lg transition-all ${alert.resolved ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${
                    alert.severity === 'critical' ? 'bg-red-100' :
                    alert.severity === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  } rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <AlertCircle className={`w-7 h-7 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{alert.title}</h3>
                          <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          {alert.resolved && (
                            <Badge className="bg-green-100 text-green-700 border-0">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Server className="w-4 h-4" />
                            <span>{alert.service}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{alert.timestamp}</span>
                          </div>
                          <span>•</span>
                          <span>{alert.id}</span>
                        </div>
                      </div>

                      {!alert.resolved && (
                        <Button
                          size="sm"
                          onClick={() => handleResolveAlert(alert)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}