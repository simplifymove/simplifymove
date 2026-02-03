import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
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
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  Shield,
  Briefcase,
  DollarSign,
  Plane
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PolicyTemplate {
  id: string;
  name: string;
  category: 'travel' | 'expense' | 'approval' | 'booking' | 'compliance';
  description: string;
  content: string;
  rules: PolicyRule[];
  status: 'active' | 'draft';
  usedByCompanies: number;
  createdDate: string;
  lastModified: string;
}

interface PolicyRule {
  id: string;
  condition: string;
  action: string;
  value: string;
}

const mockTemplates: PolicyTemplate[] = [
  {
    id: 'TPL-001',
    name: 'Standard Travel Policy',
    category: 'travel',
    description: 'Default travel booking guidelines for all companies',
    content: 'Employees are required to book economy class for domestic flights under 2 hours. Business class is allowed for international flights over 6 hours with manager approval. Hotel stays are limited to ₹5,000 per night for domestic travel and ₹10,000 for international travel.',
    rules: [
      { id: 'R1', condition: 'Domestic flight < 2 hours', action: 'Economy class only', value: 'mandatory' },
      { id: 'R2', condition: 'International flight > 6 hours', action: 'Business class allowed', value: 'with approval' },
      { id: 'R3', condition: 'Hotel - Domestic', action: 'Max per night', value: '₹5,000' },
      { id: 'R4', condition: 'Hotel - International', action: 'Max per night', value: '₹10,000' },
    ],
    status: 'active',
    usedByCompanies: 4,
    createdDate: '2024-01-15',
    lastModified: '2024-11-20',
  },
  {
    id: 'TPL-002',
    name: 'Executive Travel Policy',
    category: 'travel',
    description: 'Premium travel guidelines for C-level executives',
    content: 'C-level executives are authorized for business class on all flights over 2 hours. First class is permitted on international flights over 10 hours. Hotel stays are unlimited but should be reasonable and justified. Airport lounge access is included.',
    rules: [
      { id: 'R1', condition: 'All flights > 2 hours', action: 'Business class allowed', value: 'auto-approved' },
      { id: 'R2', condition: 'International flight > 10 hours', action: 'First class allowed', value: 'auto-approved' },
      { id: 'R3', condition: 'Hotel stays', action: 'No limit', value: 'reasonable' },
      { id: 'R4', condition: 'Airport services', action: 'Lounge access', value: 'included' },
    ],
    status: 'active',
    usedByCompanies: 2,
    createdDate: '2024-02-10',
    lastModified: '2024-10-15',
  },
  {
    id: 'TPL-003',
    name: 'Standard Expense Policy',
    category: 'expense',
    description: 'Default expense claim and reimbursement guidelines',
    content: 'All expenses must be submitted within 15 days of transaction. Receipts are mandatory for claims above ₹500. Meal expenses are limited to ₹1,500 per day. All expenses require manager approval before reimbursement.',
    rules: [
      { id: 'R1', condition: 'Expense submission', action: 'Within days', value: '15' },
      { id: 'R2', condition: 'Claims > ₹500', action: 'Receipt required', value: 'mandatory' },
      { id: 'R3', condition: 'Meals per day', action: 'Max limit', value: '₹1,500' },
      { id: 'R4', condition: 'All expenses', action: 'Manager approval', value: 'required' },
    ],
    status: 'active',
    usedByCompanies: 5,
    createdDate: '2024-01-20',
    lastModified: '2024-12-01',
  },
  {
    id: 'TPL-004',
    name: 'Multi-Level Approval Policy',
    category: 'approval',
    description: 'Hierarchical approval workflow for high-value bookings',
    content: 'Bookings under ₹10,000 require manager approval. Bookings ₹10,000-₹50,000 require department head approval. Bookings over ₹50,000 require CFO approval. All international travel requires additional HR approval.',
    rules: [
      { id: 'R1', condition: 'Booking < ₹10,000', action: 'Manager approval', value: 'required' },
      { id: 'R2', condition: 'Booking ₹10K-₹50K', action: 'Dept head approval', value: 'required' },
      { id: 'R3', condition: 'Booking > ₹50,000', action: 'CFO approval', value: 'required' },
      { id: 'R4', condition: 'International travel', action: 'HR approval', value: 'required' },
    ],
    status: 'active',
    usedByCompanies: 3,
    createdDate: '2024-03-05',
    lastModified: '2024-11-10',
  },
  {
    id: 'TPL-005',
    name: 'Advance Booking Policy',
    category: 'booking',
    description: 'Guidelines for advance booking requirements',
    content: 'Domestic travel must be booked at least 7 days in advance. International travel must be booked at least 14 days in advance. Last-minute bookings require special approval and justification. Early booking incentives apply for bookings made 30+ days in advance.',
    rules: [
      { id: 'R1', condition: 'Domestic travel', action: 'Advance booking', value: '7 days' },
      { id: 'R2', condition: 'International travel', action: 'Advance booking', value: '14 days' },
      { id: 'R3', condition: 'Last-minute booking', action: 'Special approval', value: 'required' },
      { id: 'R4', condition: 'Booking > 30 days', action: 'Incentive eligible', value: 'yes' },
    ],
    status: 'draft',
    usedByCompanies: 1,
    createdDate: '2024-11-01',
    lastModified: '2024-12-15',
  },
];

export function GlobalPolicyTemplatesClean() {
  const [templates, setTemplates] = useState<PolicyTemplate[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    category: 'travel' as const,
    description: '',
    content: '',
  });

  // Get category color and icon
  const getCategoryDetails = (category: string) => {
    switch (category) {
      case 'travel':
        return { bg: 'bg-blue-100', text: 'text-blue-600', icon: Plane };
      case 'expense':
        return { bg: 'bg-green-100', text: 'text-green-600', icon: DollarSign };
      case 'approval':
        return { bg: 'bg-purple-100', text: 'text-purple-600', icon: CheckCircle2 };
      case 'booking':
        return { bg: 'bg-orange-100', text: 'text-orange-600', icon: Briefcase };
      case 'compliance':
        return { bg: 'bg-red-100', text: 'text-red-600', icon: Shield };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', icon: FileText };
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'draft': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Add/Edit template
  const handleSaveTemplate = () => {
    if (isEditing && selectedTemplate) {
      setTemplates(templates.map(t => t.id === selectedTemplate.id
        ? { ...t, ...formData, lastModified: new Date().toISOString().split('T')[0] }
        : t
      ));
      toast.success('Policy template updated successfully');
    } else {
      const newTemplate: PolicyTemplate = {
        id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
        ...formData,
        rules: [],
        status: 'draft',
        usedByCompanies: 0,
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
      };
      setTemplates([...templates, newTemplate]);
      toast.success('Policy template created successfully');
    }
    setShowFormDialog(false);
    resetForm();
  };

  // Delete template
  const handleDeleteTemplate = (template: PolicyTemplate) => {
    if (template.usedByCompanies > 0) {
      toast.error('Cannot delete template in use', {
        description: `This template is used by ${template.usedByCompanies} companies`,
      });
      return;
    }
    setTemplates(templates.filter(t => t.id !== template.id));
    toast.success('Policy template deleted successfully');
  };

  // Duplicate template
  const handleDuplicateTemplate = (template: PolicyTemplate) => {
    const newTemplate: PolicyTemplate = {
      ...template,
      id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
      name: `${template.name} (Copy)`,
      status: 'draft',
      usedByCompanies: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    };
    setTemplates([...templates, newTemplate]);
    toast.success('Policy template duplicated successfully');
  };

  // Toggle status
  const handleToggleStatus = (template: PolicyTemplate) => {
    const newStatus = template.status === 'active' ? 'draft' : 'active';
    setTemplates(templates.map(t => t.id === template.id
      ? { ...t, status: newStatus, lastModified: new Date().toISOString().split('T')[0] }
      : t
    ));
    toast.success(`Policy template ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'travel',
      description: '',
      content: '',
    });
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    if (categoryFilter !== 'all' && template.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && template.status !== statusFilter) return false;

    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !template.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !template.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const activeTemplates = templates.filter(t => t.status === 'active').length;
  const totalUsage = templates.reduce((sum, t) => sum + t.usedByCompanies, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Global Policy Templates</h1>
              <p className="text-gray-600 mt-1">Create and manage reusable policy templates for companies</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowFormDialog(true);
              }}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Templates</p>
                  <p className="text-3xl font-bold text-gray-900">{templates.length}</p>
                  <p className="text-xs text-gray-600 mt-2">{activeTemplates} active</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Templates</p>
                  <p className="text-3xl font-bold text-green-600">{activeTemplates}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Usage</p>
                  <p className="text-3xl font-bold text-purple-600">{totalUsage}</p>
                  <p className="text-xs text-gray-600 mt-2">Companies using</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-purple-600" />
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
                placeholder="Search templates by name, description, or ID..."
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
              <option value="travel">Travel</option>
              <option value="expense">Expense</option>
              <option value="approval">Approval</option>
              <option value="booking">Booking</option>
              <option value="compliance">Compliance</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {filteredTemplates.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No policy templates found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.map((template) => {
              const categoryDetails = getCategoryDetails(template.category);
              const CategoryIcon = categoryDetails.icon;

              return (
                <Card key={template.id} className="p-6 border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${categoryDetails.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <CategoryIcon className={`w-7 h-7 ${categoryDetails.text}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900">{template.name}</h3>
                            <Badge variant="outline" className={getStatusColor(template.status)}>
                              {template.status}
                            </Badge>
                            <Badge variant="outline" className={`${categoryDetails.bg} ${categoryDetails.text} border-0`}>
                              {template.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <p className="text-xs text-gray-500">{template.id}</p>
                        </div>
                      </div>

                      {/* Rules Preview */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Policy Rules ({template.rules.length})</p>
                        <div className="space-y-2">
                          {template.rules.slice(0, 2).map((rule) => (
                            <div key={rule.id} className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 bg-[#000035] rounded-full" />
                              <span className="text-gray-700">{rule.condition}</span>
                              <span className="text-gray-400">→</span>
                              <span className="font-medium text-gray-900">{rule.action}: {rule.value}</span>
                            </div>
                          ))}
                          {template.rules.length > 2 && (
                            <p className="text-xs text-blue-600 ml-5">+{template.rules.length - 2} more rules</p>
                          )}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Used By</p>
                          <p className="text-lg font-bold text-gray-900">{template.usedByCompanies} companies</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Created</p>
                          <p className="text-sm font-semibold text-gray-900">{template.createdDate}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Last Modified</p>
                          <p className="text-sm font-semibold text-gray-900">{template.lastModified}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setFormData({
                              name: template.name,
                              category: template.category,
                              description: template.description,
                              content: template.content,
                            });
                            setIsEditing(true);
                            setShowFormDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(template)}
                        >
                          {template.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template)}
                          className="text-red-600 hover:text-red-700"
                          disabled={template.usedByCompanies > 0}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Template Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Policy Template' : 'Create Policy Template'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update policy template details' : 'Create a new reusable policy template'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Standard Travel Policy"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="template-category">Category *</Label>
              <select
                id="template-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="travel">Travel</option>
                <option value="expense">Expense</option>
                <option value="approval">Approval</option>
                <option value="booking">Booking</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>

            <div>
              <Label htmlFor="template-description">Description *</Label>
              <Textarea
                id="template-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the policy template"
                className="mt-2"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="template-content">Policy Content *</Label>
              <Textarea
                id="template-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Detailed policy content and guidelines..."
                className="mt-2"
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFormDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveTemplate}
              className="bg-[#000035] hover:bg-[#000055]"
              disabled={!formData.name || !formData.description || !formData.content}
            >
              {isEditing ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getCategoryDetails(selectedTemplate.category).bg} rounded-xl flex items-center justify-center`}>
                    {(() => {
                      const Icon = getCategoryDetails(selectedTemplate.category).icon;
                      return <Icon className={`w-6 h-6 ${getCategoryDetails(selectedTemplate.category).text}`} />;
                    })()}
                  </div>
                  <div>
                    <h2>{selectedTemplate.name}</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedTemplate.id}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(selectedTemplate.status)}>
                    {selectedTemplate.status}
                  </Badge>
                  <Badge variant="outline" className={`${getCategoryDetails(selectedTemplate.category).bg} ${getCategoryDetails(selectedTemplate.category).text} border-0`}>
                    {selectedTemplate.category}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedTemplate.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Policy Content</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">{selectedTemplate.content}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Policy Rules ({selectedTemplate.rules.length})</h3>
                  <div className="space-y-3">
                    {selectedTemplate.rules.map((rule) => (
                      <Card key={rule.id} className="p-4 bg-blue-50 border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">{rule.condition}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-600">Action:</span>
                              <span className="font-medium text-gray-900">{rule.action}</span>
                              <span className="text-gray-400">→</span>
                              <Badge className="bg-blue-600 text-white border-0">{rule.value}</Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Template Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Used By Companies</p>
                      <p className="font-semibold">{selectedTemplate.usedByCompanies}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-semibold">{selectedTemplate.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created Date</p>
                      <p className="font-semibold">{selectedTemplate.createdDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Modified</p>
                      <p className="font-semibold">{selectedTemplate.lastModified}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <DialogFooter>
                <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}