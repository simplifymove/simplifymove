import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Building2,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'analytics' | 'compliance' | 'custom';
  format: 'pdf' | 'excel' | 'csv';
  frequency: 'on_demand' | 'daily' | 'weekly' | 'monthly';
  lastGenerated?: string;
  dataPoints: string[];
}

interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  generatedDate: string;
  generatedBy: string;
  dateRange: string;
  format: string;
  fileSize: string;
  status: 'ready' | 'generating' | 'failed';
}

const mockTemplates: ReportTemplate[] = [
  {
    id: 'RPT-001',
    name: 'Monthly Revenue Report',
    description: 'Comprehensive monthly revenue breakdown by company and subscription plan',
    category: 'financial',
    format: 'excel',
    frequency: 'monthly',
    lastGenerated: '2024-12-01',
    dataPoints: ['Total Revenue', 'Company-wise Revenue', 'Plan-wise Revenue', 'Growth Rate', 'MRR'],
  },
  {
    id: 'RPT-002',
    name: 'Platform Usage Analytics',
    description: 'Detailed platform usage statistics and user engagement metrics',
    category: 'analytics',
    format: 'pdf',
    frequency: 'weekly',
    lastGenerated: '2024-12-20',
    dataPoints: ['Active Users', 'Total Bookings', 'API Calls', 'Feature Usage', 'Session Duration'],
  },
  {
    id: 'RPT-003',
    name: 'Company Performance Report',
    description: 'Individual company performance metrics and KPIs',
    category: 'operational',
    format: 'excel',
    frequency: 'monthly',
    lastGenerated: '2024-12-01',
    dataPoints: ['Bookings Count', 'Booking Value', 'Active Users', 'Wallet Balance', 'Expenses'],
  },
  {
    id: 'RPT-004',
    name: 'Subscription & Billing Summary',
    description: 'Subscription status, billing cycles, and payment tracking',
    category: 'financial',
    format: 'pdf',
    frequency: 'monthly',
    lastGenerated: '2024-12-01',
    dataPoints: ['Active Subscriptions', 'Invoices Paid', 'Pending Payments', 'Revenue by Plan', 'Churn Rate'],
  },
  {
    id: 'RPT-005',
    name: 'System Health Report',
    description: 'Infrastructure health, uptime, and performance metrics',
    category: 'operational',
    format: 'pdf',
    frequency: 'daily',
    lastGenerated: '2024-12-24',
    dataPoints: ['Server Uptime', 'API Response Time', 'Error Rate', 'Database Performance', 'Storage Usage'],
  },
  {
    id: 'RPT-006',
    name: 'Compliance & Audit Log',
    description: 'Complete audit trail and compliance documentation',
    category: 'compliance',
    format: 'csv',
    frequency: 'on_demand',
    dataPoints: ['User Actions', 'System Changes', 'Access Logs', 'Security Events', 'Policy Changes'],
  },
  {
    id: 'RPT-007',
    name: 'Vendor Integration Report',
    description: 'Third-party vendor performance and integration metrics',
    category: 'operational',
    format: 'excel',
    frequency: 'monthly',
    lastGenerated: '2024-12-01',
    dataPoints: ['API Calls', 'Success Rate', 'Response Time', 'Error Count', 'Cost Analysis'],
  },
  {
    id: 'RPT-008',
    name: 'User Growth & Acquisition',
    description: 'User growth trends and acquisition channels',
    category: 'analytics',
    format: 'pdf',
    frequency: 'weekly',
    lastGenerated: '2024-12-20',
    dataPoints: ['New Companies', 'New Users', 'Growth Rate', 'Retention Rate', 'User Demographics'],
  },
];

const mockGeneratedReports: GeneratedReport[] = [
  {
    id: 'GEN-001',
    templateId: 'RPT-001',
    templateName: 'Monthly Revenue Report',
    generatedDate: '2024-12-24',
    generatedBy: 'System Administrator',
    dateRange: 'November 2024',
    format: 'XLSX',
    fileSize: '2.4 MB',
    status: 'ready',
  },
  {
    id: 'GEN-002',
    templateId: 'RPT-002',
    templateName: 'Platform Usage Analytics',
    generatedDate: '2024-12-23',
    generatedBy: 'Raghava Boyidi',
    dateRange: 'Dec 16-22, 2024',
    format: 'PDF',
    fileSize: '1.8 MB',
    status: 'ready',
  },
  {
    id: 'GEN-003',
    templateId: 'RPT-005',
    templateName: 'System Health Report',
    generatedDate: '2024-12-24',
    generatedBy: 'Automated System',
    dateRange: 'December 23, 2024',
    format: 'PDF',
    fileSize: '850 KB',
    status: 'ready',
  },
  {
    id: 'GEN-004',
    templateId: 'RPT-003',
    templateName: 'Company Performance Report',
    generatedDate: '2024-12-24',
    generatedBy: 'System Administrator',
    dateRange: 'Q4 2024',
    format: 'XLSX',
    fileSize: '3.1 MB',
    status: 'generating',
  },
];

export function PlatformReportsExportClean() {
  const [templates, setTemplates] = useState<ReportTemplate[]>(mockTemplates);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(mockGeneratedReports);
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedDateRange, setSelectedDateRange] = useState('this_month');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'operational': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'analytics': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'compliance': return { bg: 'bg-red-100', text: 'text-red-600' };
      case 'custom': return { bg: 'bg-orange-100', text: 'text-orange-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Get format icon
  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf': return FileText;
      case 'excel':
      case 'xlsx': return FileSpreadsheet;
      case 'csv': return FileSpreadsheet;
      default: return FileText;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-50 text-green-700 border-green-200';
      case 'generating': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Generate report
  const handleGenerateReport = (template: ReportTemplate) => {
    const newReport: GeneratedReport = {
      id: `GEN-${String(generatedReports.length + 1).padStart(3, '0')}`,
      templateId: template.id,
      templateName: template.name,
      generatedDate: new Date().toISOString().split('T')[0],
      generatedBy: 'System Administrator',
      dateRange: selectedDateRange.replace('_', ' '),
      format: selectedFormat.toUpperCase(),
      fileSize: '0 KB',
      status: 'generating',
    };

    setGeneratedReports([newReport, ...generatedReports]);
    toast.success('Report generation started', {
      description: 'Your report will be ready in a few moments',
    });

    // Simulate report generation
    setTimeout(() => {
      setGeneratedReports(reports =>
        reports.map(r =>
          r.id === newReport.id
            ? { ...r, status: 'ready', fileSize: `${(Math.random() * 3 + 0.5).toFixed(1)} MB` }
            : r
        )
      );
      toast.success('Report generated successfully!');
    }, 3000);
  };

  // Download report
  const handleDownloadReport = (report: GeneratedReport) => {
    toast.success(`Downloading ${report.templateName}...`, {
      description: `Format: ${report.format} • Size: ${report.fileSize}`,
    });
  };

  // Export all data
  const handleExportAllData = () => {
    toast.success('Exporting complete platform data...', {
      description: 'This may take several minutes',
    });
  };

  const readyReports = generatedReports.filter(r => r.status === 'ready').length;
  const generatingReports = generatedReports.filter(r => r.status === 'generating').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Reports & Export</h1>
              <p className="text-gray-600 mt-1">Generate comprehensive reports and export platform data</p>
            </div>
            <Button
              onClick={handleExportAllData}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Report Templates</p>
                  <p className="text-3xl font-bold text-gray-900">{templates.length}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Generated Reports</p>
                  <p className="text-3xl font-bold text-gray-900">{generatedReports.length}</p>
                  <p className="text-xs text-gray-600 mt-2">{readyReports} ready</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Generating</p>
                  <p className="text-3xl font-bold text-blue-600">{generatingReports}</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Categories</p>
                  <p className="text-3xl font-bold text-orange-600">5</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FileSpreadsheet className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="templates" className="data-[state=active]:bg-white">
                Report Templates ({templates.length})
              </TabsTrigger>
              <TabsTrigger value="generated" className="data-[state=active]:bg-white">
                Generated Reports ({generatedReports.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Generation Controls */}
            <Card className="p-6 border-gray-200 bg-blue-50">
              <h3 className="font-semibold text-gray-900 mb-4">Report Generation Settings</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <select
                    id="date-range"
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="this_week">This Week</option>
                    <option value="last_week">Last Week</option>
                    <option value="this_month">This Month</option>
                    <option value="last_month">Last Month</option>
                    <option value="this_quarter">This Quarter</option>
                    <option value="this_year">This Year</option>
                    <option value="all_time">All Time</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <select
                    id="format"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV File</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Templates List */}
            <div className="space-y-4">
              {templates.map((template) => {
                const categoryColor = getCategoryColor(template.category);
                const FormatIcon = getFormatIcon(template.format);

                return (
                  <Card key={template.id} className="p-6 border-gray-200 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 ${categoryColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <BarChart3 className={`w-7 h-7 ${categoryColor.text}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-gray-900">{template.name}</h3>
                              <Badge variant="outline" className={`${categoryColor.bg} ${categoryColor.text} border-0`}>
                                {template.category}
                              </Badge>
                              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                                <FormatIcon className="w-3 h-3 mr-1" />
                                {template.format.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                                {template.frequency.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                            <p className="text-xs text-gray-500">{template.id}</p>
                          </div>
                        </div>

                        {/* Data Points */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <p className="text-xs font-semibold text-gray-600 mb-2">
                            Included Data Points ({template.dataPoints.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {template.dataPoints.map((point, idx) => (
                              <Badge key={idx} variant="outline" className="bg-white text-gray-700 border-gray-200">
                                {point}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            {template.lastGenerated && (
                              <p className="text-sm text-gray-600">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Last generated: {template.lastGenerated}
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={() => handleGenerateReport(template)}
                            className="bg-[#000035] hover:bg-[#000055]"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Generate Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'generated' && (
          <div className="space-y-4">
            {generatedReports.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports generated yet</h3>
                <p className="text-gray-600">Generate your first report from the Templates tab</p>
              </Card>
            ) : (
              generatedReports.map((report) => {
                const FormatIcon = getFormatIcon(report.format);

                return (
                  <Card key={report.id} className="p-6 border-gray-200 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FormatIcon className="w-7 h-7 text-green-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-gray-900">{report.templateName}</h3>
                              <Badge variant="outline" className={getStatusColor(report.status)}>
                                {report.status === 'generating' ? (
                                  <>
                                    <Activity className="w-3 h-3 mr-1 animate-spin" />
                                    Generating...
                                  </>
                                ) : report.status === 'ready' ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Ready
                                  </>
                                ) : (
                                  'Failed'
                                )}
                              </Badge>
                              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                                {report.format}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Date Range: {report.dateRange}</p>
                            <p className="text-xs text-gray-500">{report.id}</p>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Generated</p>
                            <p className="text-sm font-semibold text-gray-900">{report.generatedDate}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Generated By</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">{report.generatedBy}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">File Size</p>
                            <p className="text-sm font-semibold text-gray-900">{report.fileSize}</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Format</p>
                            <p className="text-sm font-semibold text-gray-900">{report.format}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {report.status === 'ready' && (
                            <Button
                              onClick={() => handleDownloadReport(report)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Report
                            </Button>
                          )}
                          {report.status === 'generating' && (
                            <Button disabled variant="outline">
                              <Activity className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}