import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  FileText,
  Search,
  Download,
  Eye,
  Shield,
  Building2,
  Users,
  Activity,
  AlertCircle,
  CheckCircle2,
  Settings,
  DollarSign,
  Globe
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PlatformAuditLog {
  id: string;
  timestamp: string;
  time: string;
  action: string;
  category: 'company' | 'user' | 'subscription' | 'system' | 'security' | 'billing';
  performedBy: string;
  performedByRole: 'super_admin' | 'system';
  companyId?: string;
  companyName?: string;
  targetEntity: string;
  targetId: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

const mockPlatformLogs: PlatformAuditLog[] = [
  {
    id: 'PLOG-001',
    timestamp: '2024-12-24',
    time: '11:45 AM',
    action: 'Company Created',
    category: 'company',
    performedBy: 'System Administrator',
    performedByRole: 'super_admin',
    targetEntity: 'Company',
    targetId: 'COMP-006',
    details: 'New company "Logistics Pro" registered on Enterprise plan',
    ipAddress: '192.168.1.100',
    status: 'success',
    severity: 'medium',
    changes: [
      { field: 'Company Name', oldValue: '-', newValue: 'Logistics Pro' },
      { field: 'Plan', oldValue: '-', newValue: 'Enterprise' },
      { field: 'Status', oldValue: '-', newValue: 'Active' },
    ],
  },
  {
    id: 'PLOG-002',
    timestamp: '2024-12-24',
    time: '10:30 AM',
    action: 'Company Suspended',
    category: 'company',
    performedBy: 'System Administrator',
    performedByRole: 'super_admin',
    companyId: 'COMP-004',
    companyName: 'Finance Pro Services',
    targetEntity: 'Company',
    targetId: 'COMP-004',
    details: 'Company suspended due to payment failure',
    ipAddress: '192.168.1.100',
    status: 'success',
    severity: 'high',
    changes: [
      { field: 'Status', oldValue: 'Active', newValue: 'Suspended' },
      { field: 'Suspension Reason', oldValue: '-', newValue: 'Payment Overdue' },
    ],
  },
  {
    id: 'PLOG-003',
    timestamp: '2024-12-24',
    time: '09:15 AM',
    action: 'Subscription Upgraded',
    category: 'subscription',
    performedBy: 'Raghava Boyidi',
    performedByRole: 'super_admin',
    companyId: 'COMP-002',
    companyName: 'Global Marketing Solutions',
    targetEntity: 'Subscription',
    targetId: 'SUB-002',
    details: 'Company upgraded from Basic to Pro plan',
    ipAddress: '192.168.1.101',
    status: 'success',
    severity: 'medium',
    changes: [
      { field: 'Plan', oldValue: 'Basic', newValue: 'Pro' },
      { field: 'Monthly Fee', oldValue: '₹5,000', newValue: '₹15,000' },
      { field: 'Features', oldValue: '2 Features', newValue: '5 Features' },
    ],
  },
  {
    id: 'PLOG-004',
    timestamp: '2024-12-23',
    time: '06:45 PM',
    action: 'System Configuration Updated',
    category: 'system',
    performedBy: 'System Administrator',
    performedByRole: 'super_admin',
    targetEntity: 'System Config',
    targetId: 'CONFIG-GLOBAL',
    details: 'Global platform settings modified',
    ipAddress: '192.168.1.100',
    status: 'success',
    severity: 'high',
    changes: [
      { field: 'Max File Size', oldValue: '5MB', newValue: '10MB' },
      { field: 'Session Timeout', oldValue: '30 minutes', newValue: '60 minutes' },
    ],
  },
  {
    id: 'PLOG-005',
    timestamp: '2024-12-23',
    time: '04:30 PM',
    action: 'Failed Login Attempt',
    category: 'security',
    performedBy: 'Unknown User',
    performedByRole: 'system',
    targetEntity: 'Super Admin Account',
    targetId: 'SA-003',
    details: 'Multiple failed login attempts detected',
    ipAddress: '203.45.67.89',
    status: 'failed',
    severity: 'critical',
  },
  {
    id: 'PLOG-006',
    timestamp: '2024-12-23',
    time: '03:15 PM',
    action: 'Super Admin Created',
    category: 'user',
    performedBy: 'System Administrator',
    performedByRole: 'super_admin',
    targetEntity: 'Super Admin',
    targetId: 'SA-006',
    details: 'New super admin account created for platform operations',
    ipAddress: '192.168.1.100',
    status: 'success',
    severity: 'high',
    changes: [
      { field: 'Name', oldValue: '-', newValue: 'Operations Manager' },
      { field: 'Role', oldValue: '-', newValue: 'Super Admin' },
      { field: '2FA', oldValue: '-', newValue: 'Enabled' },
    ],
  },
  {
    id: 'PLOG-007',
    timestamp: '2024-12-23',
    time: '01:00 PM',
    action: 'Payment Processed',
    category: 'billing',
    performedBy: 'Payment Gateway',
    performedByRole: 'system',
    companyId: 'COMP-001',
    companyName: 'Tech Innovations Ltd',
    targetEntity: 'Invoice',
    targetId: 'INV-2024-125',
    details: 'Monthly subscription payment processed successfully',
    ipAddress: '192.168.1.200',
    status: 'success',
    severity: 'low',
    changes: [
      { field: 'Payment Status', oldValue: 'Pending', newValue: 'Paid' },
      { field: 'Amount', oldValue: '-', newValue: '₹50,000' },
    ],
  },
  {
    id: 'PLOG-008',
    timestamp: '2024-12-22',
    time: '11:30 AM',
    action: 'Database Backup',
    category: 'system',
    performedBy: 'Automated System',
    performedByRole: 'system',
    targetEntity: 'Database',
    targetId: 'DB-PRIMARY',
    details: 'Scheduled database backup completed',
    ipAddress: '127.0.0.1',
    status: 'success',
    severity: 'low',
  },
];

export function PlatformAuditLogsClean() {
  const [logs, setLogs] = useState<PlatformAuditLog[]>(mockPlatformLogs);
  const [selectedLog, setSelectedLog] = useState<PlatformAuditLog | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'company': return Building2;
      case 'user': return Users;
      case 'subscription': return DollarSign;
      case 'system': return Settings;
      case 'security': return Shield;
      case 'billing': return DollarSign;
      default: return FileText;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'company': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'user': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'subscription': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'system': return { bg: 'bg-orange-100', text: 'text-orange-600' };
      case 'security': return { bg: 'bg-red-100', text: 'text-red-600' };
      case 'billing': return { bg: 'bg-yellow-100', text: 'text-yellow-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 text-green-700 border-green-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && log.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && log.status !== statusFilter) return false;

    if (searchQuery && !log.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !log.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !log.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(log.companyName && log.companyName.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !log.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Export logs
  const handleExportLogs = () => {
    toast.success('Exporting platform audit logs...', {
      description: 'Your report will be downloaded shortly',
    });
  };

  const successCount = logs.filter(l => l.status === 'success').length;
  const failedCount = logs.filter(l => l.status === 'failed').length;
  const criticalCount = logs.filter(l => l.severity === 'critical').length;
  const categories = Array.from(new Set(logs.map(l => l.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Audit Logs</h1>
              <p className="text-gray-600 mt-1">System-wide activity tracking and security monitoring</p>
            </div>
            <Button
              onClick={handleExportLogs}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Logs</p>
                  <p className="text-3xl font-bold text-gray-900">{logs.length}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Successful</p>
                  <p className="text-3xl font-bold text-green-600">{successCount}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Failed</p>
                  <p className="text-3xl font-bold text-red-600">{failedCount}</p>
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-red-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Critical</p>
                  <p className="text-3xl font-bold text-orange-600">{criticalCount}</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by action, user, company, entity, or log ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {filteredLogs.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No audit logs found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Performed By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Target
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.map((log) => {
                    const CategoryIcon = getCategoryIcon(log.category);
                    const categoryColor = getCategoryColor(log.category);

                    return (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{log.timestamp}</p>
                            <p className="text-xs text-gray-500">{log.time}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{log.action}</p>
                            <p className="text-xs text-gray-600 mt-1">{log.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 ${categoryColor.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <CategoryIcon className={`w-4 h-4 ${categoryColor.text}`} />
                            </div>
                            <Badge variant="outline" className={`${categoryColor.bg} ${categoryColor.text} border-0`}>
                              {log.category}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{log.performedBy}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {log.performedByRole}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {log.companyName ? (
                            <div>
                              <p className="text-sm font-medium text-gray-900">{log.companyName}</p>
                              <p className="text-xs text-gray-500">{log.companyId}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-900">{log.targetEntity}</p>
                            <p className="text-xs text-gray-500">{log.targetId}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={getStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={getSeverityColor(log.severity)}>
                            {log.severity}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700 font-mono">{log.ipAddress}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            onClick={() => {
                              setSelectedLog(log);
                              setShowDetailsDialog(true);
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Log Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedLog && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getCategoryColor(selectedLog.category).bg} rounded-xl flex items-center justify-center`}>
                    {(() => {
                      const Icon = getCategoryIcon(selectedLog.category);
                      return <Icon className={`w-6 h-6 ${getCategoryColor(selectedLog.category).text}`} />;
                    })()}
                  </div>
                  <div>
                    <h2>{selectedLog.action}</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedLog.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Complete platform audit log details
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Status & Severity */}
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(selectedLog.status)}>
                    {selectedLog.status}
                  </Badge>
                  <Badge variant="outline" className={getSeverityColor(selectedLog.severity)}>
                    {selectedLog.severity} severity
                  </Badge>
                  <Badge variant="outline" className={`${getCategoryColor(selectedLog.category).bg} ${getCategoryColor(selectedLog.category).text} border-0`}>
                    {selectedLog.category}
                  </Badge>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLog.details}</p>
                </div>

                {/* Company Info */}
                {selectedLog.companyName && (
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <h3 className="font-semibold mb-2">Related Company</h3>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{selectedLog.companyName}</p>
                        <p className="text-sm text-gray-600">{selectedLog.companyId}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Metadata */}
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Metadata</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Performed By</p>
                      <p className="font-semibold">{selectedLog.performedBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Role</p>
                      <p className="font-semibold">{selectedLog.performedByRole}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Timestamp</p>
                      <p className="font-semibold">{selectedLog.timestamp} at {selectedLog.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">IP Address</p>
                      <p className="font-semibold">{selectedLog.ipAddress}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target Entity</p>
                      <p className="font-semibold">{selectedLog.targetEntity}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target ID</p>
                      <p className="font-semibold">{selectedLog.targetId}</p>
                    </div>
                  </div>
                </Card>

                {/* Changes */}
                {selectedLog.changes && selectedLog.changes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Changes Made</h3>
                    <div className="space-y-3">
                      {selectedLog.changes.map((change, idx) => (
                        <Card key={idx} className="p-4 bg-purple-50 border-purple-200">
                          <p className="text-sm font-semibold text-gray-900 mb-2">{change.field}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex-1">
                              <p className="text-xs text-gray-600 mb-1">Old Value</p>
                              <p className="font-semibold text-red-700 line-through">{change.oldValue}</p>
                            </div>
                            <span className="text-gray-600">→</span>
                            <div className="flex-1">
                              <p className="text-xs text-gray-600 mb-1">New Value</p>
                              <p className="font-semibold text-green-700">{change.newValue}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}