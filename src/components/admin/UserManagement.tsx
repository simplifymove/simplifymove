import { useState, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone,
  Building2,
  Edit,
  Trash2,
  Shield,
  Wallet,
  User,
  Briefcase,
  MapPin,
  Upload,
  Download,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Crown,
  DollarSign,
  Receipt,
  TrendingUp,
  Settings as SettingsIcon,
  FileSpreadsheet,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import { AddEmployeeBasicSheet, AssignRoleSheet } from './EmployeeManagementSheets';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  jobRole: string;
  systemRole: 'Admin' | 'Manager' | 'Finance' | 'HR' | 'Employee';
  joinDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  businessWallet: number;
  personalWallet: number;
  address: string;
  permissions: string[];
}

interface ImportPreviewData {
  name: string;
  email: string;
  phone: string;
  department: string;
  jobRole: string;
  address: string;
  status?: string;
  isValid: boolean;
  errors: string[];
}

const rolePermissions = {
  Admin: {
    label: 'Admin',
    description: 'Full access to all features',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Crown,
    permissions: ['All Features', 'User Management', 'Finance', 'Analytics', 'Settings']
  },
  Manager: {
    label: 'Manager',
    description: 'Manage approvals, employees, and view analytics',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Briefcase,
    permissions: ['Approvals', 'Employees', 'Analytics', 'Reports']
  },
  Finance: {
    label: 'Finance',
    description: 'Access only Finance & Expenses section',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: DollarSign,
    permissions: ['Expense Claims', 'Expense Policies', 'Reimbursements', 'Finance Reports']
  },
  HR: {
    label: 'HR',
    description: 'Manage employees, policies, and settings',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: Users,
    permissions: ['Employees', 'Policies', 'Settings', 'User Management']
  },
  Employee: {
    label: 'Employee',
    description: 'Standard employee access',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: User,
    permissions: ['Book Travel', 'Submit Expenses', 'View Own Data']
  }
};

// All available permissions in the system
const allPermissions = [
  { id: 'all_features', label: 'All Features', category: 'Admin' },
  { id: 'user_management', label: 'User Management', category: 'Admin' },
  { id: 'settings', label: 'Settings', category: 'Admin' },
  { id: 'approvals', label: 'Approvals', category: 'Management' },
  { id: 'employees', label: 'Employees', category: 'Management' },
  { id: 'analytics', label: 'Analytics', category: 'Reports' },
  { id: 'reports', label: 'Reports', category: 'Reports' },
  { id: 'expense_claims', label: 'Expense Claims', category: 'Finance' },
  { id: 'expense_policies', label: 'Expense Policies', category: 'Finance' },
  { id: 'reimbursements', label: 'Reimbursements', category: 'Finance' },
  { id: 'finance_reports', label: 'Finance Reports', category: 'Finance' },
  { id: 'policies', label: 'Policies', category: 'HR' },
  { id: 'book_travel', label: 'Book Travel', category: 'Employee' },
  { id: 'submit_expenses', label: 'Submit Expenses', category: 'Employee' },
  { id: 'view_own_data', label: 'View Own Data', category: 'Employee' },
];

// Group permissions by category
const permissionCategories = {
  'Admin': allPermissions.filter(p => p.category === 'Admin'),
  'Management': allPermissions.filter(p => p.category === 'Management'),
  'Reports': allPermissions.filter(p => p.category === 'Reports'),
  'Finance': allPermissions.filter(p => p.category === 'Finance'),
  'HR': allPermissions.filter(p => p.category === 'HR'),
  'Employee': allPermissions.filter(p => p.category === 'Employee'),
};

const initialUsers: UserData[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@acme.com',
    phone: '+91 98765 43210',
    department: 'Sales',
    jobRole: 'Senior Sales Manager',
    systemRole: 'Manager',
    joinDate: '2023-01-15',
    status: 'Active',
    businessWallet: 25000,
    personalWallet: 5000,
    address: 'Mumbai, India',
    permissions: ['Approvals', 'Employees', 'Analytics', 'Reports']
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@acme.com',
    phone: '+91 98765 43211',
    department: 'Finance',
    jobRole: 'Finance Manager',
    systemRole: 'Finance',
    joinDate: '2023-03-20',
    status: 'Active',
    businessWallet: 30000,
    personalWallet: 8000,
    address: 'Delhi, India',
    permissions: ['Expense Claims', 'Expense Policies', 'Reimbursements', 'Finance Reports']
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@acme.com',
    phone: '+91 98765 43212',
    department: 'Marketing',
    jobRole: 'Marketing Executive',
    systemRole: 'Employee',
    joinDate: '2023-02-10',
    status: 'Active',
    businessWallet: 20000,
    personalWallet: 6000,
    address: 'Bangalore, India',
    permissions: ['Book Travel', 'Submit Expenses', 'View Own Data']
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah.w@acme.com',
    phone: '+91 98765 43213',
    department: 'HR',
    jobRole: 'HR Manager',
    systemRole: 'HR',
    joinDate: '2022-11-05',
    status: 'Active',
    businessWallet: 35000,
    personalWallet: 10000,
    address: 'Hyderabad, India',
    permissions: ['Employees', 'Policies', 'Settings', 'User Management']
  },
  {
    id: 5,
    name: 'Raj Kumar',
    email: 'raj.kumar@acme.com',
    phone: '+91 98765 43214',
    department: 'Technology',
    jobRole: 'Software Engineer',
    systemRole: 'Employee',
    joinDate: '2023-06-15',
    status: 'Active',
    businessWallet: 15000,
    personalWallet: 3000,
    address: 'Pune, India',
    permissions: ['Book Travel', 'Submit Expenses', 'View Own Data']
  },
  {
    id: 6,
    name: 'Priya Sharma',
    email: 'priya.sharma@acme.com',
    phone: '+91 98765 43215',
    department: 'Operations',
    jobRole: 'Operations Head',
    systemRole: 'Admin',
    joinDate: '2022-09-01',
    status: 'Active',
    businessWallet: 40000,
    personalWallet: 12000,
    address: 'Chennai, India',
    permissions: ['All Features', 'User Management', 'Finance', 'Analytics', 'Settings']
  },
];

export function UserManagement() {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddEmployeeBasicSheet, setShowAddEmployeeBasicSheet] = useState(false);
  const [showAssignRoleSheet, setShowAssignRoleSheet] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');

  // Import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importPreview, setImportPreview] = useState<ImportPreviewData[]>([]);
  const [showImportPreview, setShowImportPreview] = useState(false);

  // Basic employee form (no role)
  const [basicEmployeeForm, setBasicEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Sales',
    jobRole: '',
    address: '',
  });

  // Assign role state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [assignRoleForm, setAssignRoleForm] = useState({
    systemRole: 'Employee' as UserData['systemRole'],
    businessWallet: '0',
    personalWallet: '0',
  });

  // Form state (for create with role)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Sales',
    jobRole: '',
    systemRole: 'Employee' as UserData['systemRole'],
    address: '',
    businessWallet: '0',
    personalWallet: '0',
    status: 'Active' as UserData['status'],
  });

  // Permissions state
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'Sales',
      jobRole: '',
      systemRole: 'Employee',
      address: '',
      businessWallet: '0',
      personalWallet: '0',
      status: 'Active',
    });
    setSelectedPermissions([]);
  };

  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.jobRole) {
      toast.error('Please fill all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const newUser: UserData = {
      id: users.length + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      jobRole: formData.jobRole,
      systemRole: formData.systemRole,
      joinDate: new Date().toISOString().split('T')[0],
      status: formData.status,
      businessWallet: parseFloat(formData.businessWallet) || 0,
      personalWallet: parseFloat(formData.personalWallet) || 0,
      address: formData.address,
      permissions: selectedPermissions.length > 0 ? selectedPermissions : rolePermissions[formData.systemRole].permissions
    };

    setUsers([...users, newUser]);
    toast.success(`${formData.name} added successfully with ${formData.systemRole} role!`);
    setShowAddSheet(false);
    resetForm();
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { 
            ...user, 
            ...formData,
            businessWallet: parseFloat(formData.businessWallet) || 0,
            personalWallet: parseFloat(formData.personalWallet) || 0,
            permissions: selectedPermissions
          }
        : user
    ));

    toast.success(`${formData.name} updated successfully!`);
    setShowEditSheet(false);
    setSelectedUser(null);
    resetForm();
  };

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      jobRole: user.jobRole,
      systemRole: user.systemRole,
      address: user.address,
      businessWallet: user.businessWallet.toString(),
      personalWallet: user.personalWallet.toString(),
      status: user.status,
    });
    setSelectedPermissions(user.permissions);
    setShowEditSheet(true);
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
    toast.success('User deleted successfully');
  };

  const handleStatusToggle = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' as UserData['status'] }
        : user
    ));
    toast.success('User status updated');
  };

  // CSV Import Handlers
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      toast.error('CSV file is empty or invalid');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['name', 'email', 'phone', 'department', 'jobrole'];
    
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      toast.error(`Missing required columns: ${missingHeaders.join(', ')}`);
      return;
    }

    const preview: ImportPreviewData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      const errors: string[] = [];
      
      // Validation
      if (!row.name) errors.push('Name is required');
      if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        errors.push('Valid email is required');
      }
      if (!row.phone) errors.push('Phone is required');
      if (!row.department) errors.push('Department is required');
      if (!row.jobrole) errors.push('Job role is required');

      // Check duplicate email
      if (users.some(u => u.email.toLowerCase() === row.email.toLowerCase())) {
        errors.push('Email already exists');
      }

      preview.push({
        name: row.name,
        email: row.email,
        phone: row.phone,
        department: row.department,
        jobRole: row.jobrole,
        address: row.address || '',
        status: row.status || 'Active',
        isValid: errors.length === 0,
        errors
      });
    }

    setImportPreview(preview);
    setShowImportPreview(true);
  };

  const handleConfirmImport = () => {
    const validRows = importPreview.filter(row => row.isValid);
    
    if (validRows.length === 0) {
      toast.error('No valid rows to import');
      return;
    }

    const newUsers: UserData[] = validRows.map((row, index) => ({
      id: users.length + index + 1,
      name: row.name,
      email: row.email,
      phone: row.phone,
      department: row.department,
      jobRole: row.jobRole,
      systemRole: 'Employee', // Default role
      joinDate: new Date().toISOString().split('T')[0],
      status: (row.status === 'Active' || row.status === 'Inactive' || row.status === 'Suspended') 
        ? row.status as UserData['status'] 
        : 'Active',
      businessWallet: 0,
      personalWallet: 0,
      address: row.address,
      permissions: rolePermissions.Employee.permissions
    }));

    setUsers([...users, ...newUsers]);
    toast.success(`Successfully imported ${validRows.length} employees!`);
    setShowImportPreview(false);
    setImportPreview([]);
  };

  const downloadTemplate = () => {
    const template = 'name,email,phone,department,jobrole,address,status\nJohn Doe,john@example.com,+91 9876543210,Sales,Sales Executive,Mumbai India,Active';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully');
  };

  const handleExport = () => {
    const csv = [
      'Name,Email,Phone,Department,Job Role,System Role,Join Date,Status,Business Wallet,Personal Wallet,Address',
      ...users.map(u => 
        `${u.name},${u.email},${u.phone},${u.department},${u.jobRole},${u.systemRole},${u.joinDate},${u.status},${u.businessWallet},${u.personalWallet},${u.address}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Employees exported successfully');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.systemRole === roleFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesTab = currentTab === 'all' || user.systemRole === currentTab;
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus && matchesTab;
  });

  const departments = Array.from(new Set(users.map(u => u.department)));
  const roleStats = {
    Admin: users.filter(u => u.systemRole === 'Admin').length,
    Manager: users.filter(u => u.systemRole === 'Manager').length,
    Finance: users.filter(u => u.systemRole === 'Finance').length,
    HR: users.filter(u => u.systemRole === 'HR').length,
    Employee: users.filter(u => u.systemRole === 'Employee').length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Active: 'bg-green-100 text-green-700 border-green-200',
      Inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      Suspended: 'bg-red-100 text-red-700 border-red-200',
    };
    return variants[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-3 h-3" />;
      case 'Inactive':
        return <XCircle className="w-3 h-3" />;
      case 'Suspended':
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="mb-6">
        <div className="mb-4">
          <h2>Employee Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your company employees and assign SimplifyMove access roles
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleImportClick}>
            <Upload className="w-4 h-4 mr-2" />
            Import Employees
          </Button>
          <Button variant="outline" onClick={() => setShowAddEmployeeBasicSheet(true)}>
            <User className="w-4 h-4 mr-2" />
            Add Employee Manually
          </Button>
          <Button variant="outline" onClick={() => setShowAssignRoleSheet(true)}>
            <Shield className="w-4 h-4 mr-2" />
            Assign Role to Existing
          </Button>
          <Button onClick={() => setShowAddSheet(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Employee
          </Button>
        </div>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(rolePermissions).map(([role, config]) => {
          const Icon = config.icon;
          const count = roleStats[role as keyof typeof roleStats];
          return (
            <Card 
              key={role} 
              className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                currentTab === role ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setCurrentTab(role)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl text-gray-900">{count}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{config.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="System Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Object.keys(rolePermissions).map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setRoleFilter('all');
              setDepartmentFilter('all');
              setStatusFilter('all');
              setCurrentTab('all');
            }}
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-sm">Employee</th>
                <th className="text-left py-3 px-4 text-sm">Department</th>
                <th className="text-left py-3 px-4 text-sm">System Role</th>
                <th className="text-left py-3 px-4 text-sm">Permissions</th>
                <th className="text-left py-3 px-4 text-sm">Wallet Balance</th>
                <th className="text-left py-3 px-4 text-sm">Status</th>
                <th className="text-left py-3 px-4 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const roleConfig = rolePermissions[user.systemRole];
                const RoleIcon = roleConfig.icon;
                return (
                  <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{user.department}</p>
                        <p className="text-xs text-gray-600">{user.jobRole}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={roleConfig.color}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {user.systemRole}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.slice(0, 2).map((perm, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {perm}
                          </Badge>
                        ))}
                        {user.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.permissions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-900">
                          <Briefcase className="w-3 h-3 text-blue-600" />
                          ₹{user.businessWallet.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Wallet className="w-3 h-3" />
                          ₹{user.personalWallet.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={getStatusBadge(user.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(user.status)}
                          {user.status}
                        </div>
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Details & Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusToggle(user.id)}>
                            {user.status === 'Active' ? (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Employee
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No employees found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Import Preview Dialog */}
      <Dialog open={showImportPreview} onOpenChange={setShowImportPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Import Preview</DialogTitle>
            <DialogDescription>
              Review the employees before importing. Valid rows: {importPreview.filter(r => r.isValid).length} / {importPreview.length}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {importPreview.map((row, index) => (
                <Card key={index} className={`p-4 ${row.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {row.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-3 gap-3 mb-2">
                        <div>
                          <p className="text-xs text-gray-600">Name</p>
                          <p className="text-sm text-gray-900">{row.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Email</p>
                          <p className="text-sm text-gray-900">{row.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Phone</p>
                          <p className="text-sm text-gray-900">{row.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Department</p>
                          <p className="text-sm text-gray-900">{row.department}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Job Role</p>
                          <p className="text-sm text-gray-900">{row.jobRole}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Default Role</p>
                          <Badge variant="outline" className="bg-gray-100 text-gray-700">
                            Employee
                          </Badge>
                        </div>
                      </div>
                      {row.errors.length > 0 && (
                        <div className="flex items-start gap-2 mt-2 p-2 bg-red-100 rounded border border-red-200">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                          <div className="text-xs text-red-700">
                            {row.errors.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={() => setShowImportPreview(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmImport}
              disabled={importPreview.filter(r => r.isValid).length === 0}
            >
              <Check className="w-4 h-4 mr-2" />
              Import {importPreview.filter(r => r.isValid).length} Employees
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Employee Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>Add New Employee</SheetTitle>
            <SheetDescription>
              Create employee profile and assign SimplifyMove access role
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 py-6 space-y-5">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm text-gray-900">Employee Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="john@acme.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Job Role *</Label>
                  <Input
                    placeholder="Senior Sales Manager"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <Input
                    placeholder="City, State, Country"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t"></div>

            {/* System Role Selection */}
            <div>
              <h3 className="text-sm text-gray-900 mb-4">SimplifyMove Access & Role</h3>
              <Label>System Role *</Label>
              <Select 
                value={formData.systemRole} 
                onValueChange={(value) => {
                  setFormData({ ...formData, systemRole: value as UserData['systemRole'] });
                  setSelectedPermissions(rolePermissions[value as keyof typeof rolePermissions].permissions);
                }}
              >
                <SelectTrigger className="mt-2 h-auto py-3 [&>span]:w-full [&>span]:flex [&>span]:items-start">
                  <SelectValue>
                    <div className="flex items-start gap-2 w-full">
                      {(() => {
                        const Icon = rolePermissions[formData.systemRole].icon;
                        return <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />;
                      })()}
                      <div className="flex-1 text-left">
                        <p className="text-sm leading-tight">{rolePermissions[formData.systemRole].label}</p>
                        <p className="text-xs text-gray-500 leading-tight">{rolePermissions[formData.systemRole].description}</p>
                      </div>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(rolePermissions).map(([role, config]) => {
                    const Icon = config.icon;
                    return (
                      <SelectItem key={role} value={role} className="!py-4 !min-h-[80px] !items-start">
                        <div className="flex items-start gap-3 py-1">
                          <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm leading-tight">{config.label}</p>
                            <p className="text-xs text-gray-500 leading-tight mt-0.5">{config.description}</p>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              {/* Role Permissions Selection */}
              <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-900">Customize Permissions</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => setSelectedPermissions(allPermissions.map(p => p.label))}
                  >
                    Select All
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {Object.entries(permissionCategories).map(([category, perms]) => (
                    <div key={category} className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-700 mb-2">{category}</p>
                      <div className="space-y-2">
                        {perms.map((perm) => (
                          <div key={perm.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`add-${perm.id}`}
                              checked={selectedPermissions.includes(perm.label)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPermissions([...selectedPermissions, perm.label]);
                                } else {
                                  setSelectedPermissions(selectedPermissions.filter(p => p !== perm.label));
                                }
                              }}
                            />
                            <Label 
                              htmlFor={`add-${perm.id}`}
                              className="text-xs cursor-pointer"
                            >
                              {perm.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t"></div>

            {/* Wallet */}
            <div>
              <h3 className="text-sm text-gray-900 mb-4">Initial Wallet Balance (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Wallet</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.businessWallet}
                    onChange={(e) => setFormData({ ...formData, businessWallet: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Personal Wallet</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.personalWallet}
                    onChange={(e) => setFormData({ ...formData, personalWallet: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t flex justify-between">
            <Button variant="outline" onClick={() => {
              setShowAddSheet(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit User Sheet - Similar to Add but with edit functionality */}
      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>Edit Employee</SheetTitle>
            <SheetDescription>
              Update employee details and SimplifyMove access permissions
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 py-6 space-y-5">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm text-gray-900">Employee Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="john@acme.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Job Role *</Label>
                  <Input
                    placeholder="Senior Sales Manager"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <Input
                    placeholder="City, State, Country"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as UserData['status'] })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t"></div>

            {/* System Role Selection */}
            <div>
              <h3 className="text-sm text-gray-900 mb-4">SimplifyMove Access & Role</h3>
              <Label>System Role *</Label>
              <Select 
                value={formData.systemRole} 
                onValueChange={(value) => {
                  setFormData({ ...formData, systemRole: value as UserData['systemRole'] });
                  setSelectedPermissions(rolePermissions[value as keyof typeof rolePermissions].permissions);
                }}
              >
                <SelectTrigger className="mt-2 h-auto py-3 [&>span]:w-full [&>span]:flex [&>span]:items-start">
                  <SelectValue>
                    <div className="flex items-start gap-2 w-full">
                      {(() => {
                        const Icon = rolePermissions[formData.systemRole].icon;
                        return <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />;
                      })()}
                      <div className="flex-1 text-left">
                        <p className="text-sm leading-tight">{rolePermissions[formData.systemRole].label}</p>
                        <p className="text-xs text-gray-500 leading-tight">{rolePermissions[formData.systemRole].description}</p>
                      </div>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(rolePermissions).map(([role, config]) => {
                    const Icon = config.icon;
                    return (
                      <SelectItem key={role} value={role} className="!py-4 !min-h-[80px] !items-start">
                        <div className="flex items-start gap-3 py-1">
                          <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm leading-tight">{config.label}</p>
                            <p className="text-xs text-gray-500 leading-tight mt-0.5">{config.description}</p>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              {/* Role Permissions Selection */}
              <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-900">Customize Permissions</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => setSelectedPermissions(allPermissions.map(p => p.label))}
                  >
                    Select All
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {Object.entries(permissionCategories).map(([category, perms]) => (
                    <div key={category} className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-700 mb-2">{category}</p>
                      <div className="space-y-2">
                        {perms.map((perm) => (
                          <div key={perm.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-${perm.id}`}
                              checked={selectedPermissions.includes(perm.label)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPermissions([...selectedPermissions, perm.label]);
                                } else {
                                  setSelectedPermissions(selectedPermissions.filter(p => p !== perm.label));
                                }
                              }}
                            />
                            <Label 
                              htmlFor={`edit-${perm.id}`}
                              className="text-xs cursor-pointer"
                            >
                              {perm.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t"></div>

            {/* Wallet */}
            <div>
              <h3 className="text-sm text-gray-900 mb-4">Wallet Balance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Wallet</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.businessWallet}
                    onChange={(e) => setFormData({ ...formData, businessWallet: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Personal Wallet</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.personalWallet}
                    onChange={(e) => setFormData({ ...formData, personalWallet: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t flex justify-between">
            <Button variant="outline" onClick={() => {
              setShowEditSheet(false);
              setSelectedUser(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* CSV Import Info Banner */}
      <Card className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-900 mb-1">Need to import multiple employees at once?</p>
            <p className="text-xs text-gray-600 mb-3">
              Download our CSV template, fill in employee details, and upload to add multiple employees in bulk. 
              They will be imported with "Employee" role by default, which you can change later individually.
            </p>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Employee Manually Sheet */}
      <AddEmployeeBasicSheet
        open={showAddEmployeeBasicSheet}
        onOpenChange={setShowAddEmployeeBasicSheet}
        basicEmployeeForm={basicEmployeeForm}
        setBasicEmployeeForm={setBasicEmployeeForm}
        onSave={() => {
          if (!basicEmployeeForm.name || !basicEmployeeForm.email || !basicEmployeeForm.phone || !basicEmployeeForm.jobRole) {
            toast.error('Please fill all required fields');
            return;
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(basicEmployeeForm.email)) {
            toast.error('Please enter a valid email address');
            return;
          }
          const newEmployee: UserData = {
            id: users.length + 1,
            ...basicEmployeeForm,
            systemRole: 'Employee',
            joinDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            businessWallet: 0,
            personalWallet: 0,
            permissions: rolePermissions.Employee.permissions
          };
          setUsers([...users, newEmployee]);
          toast.success(`${basicEmployeeForm.name} added to company directory!`);
          setShowAddEmployeeBasicSheet(false);
          setBasicEmployeeForm({ name: '', email: '', phone: '', department: 'Sales', jobRole: '', address: '' });
        }}
      />

      {/* Assign Role to Existing Sheet */}
      <AssignRoleSheet
        open={showAssignRoleSheet}
        onOpenChange={setShowAssignRoleSheet}
        users={users}
        selectedEmployeeId={selectedEmployeeId}
        setSelectedEmployeeId={setSelectedEmployeeId}
        assignRoleForm={assignRoleForm}
        setAssignRoleForm={setAssignRoleForm}
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
        onSave={() => {
          if (!selectedEmployeeId) {
            toast.error('Please select an employee');
            return;
          }
          setUsers(users.map(user =>
            user.id === selectedEmployeeId
              ? {
                  ...user,
                  systemRole: assignRoleForm.systemRole,
                  businessWallet: parseFloat(assignRoleForm.businessWallet) || 0,
                  personalWallet: parseFloat(assignRoleForm.personalWallet) || 0,
                  permissions: selectedPermissions
                }
              : user
          ));
          const employeeName = users.find(u => u.id === selectedEmployeeId)?.name;
          toast.success(`${employeeName} assigned ${assignRoleForm.systemRole} role successfully!`);
          setShowAssignRoleSheet(false);
          setSelectedEmployeeId(null);
          setAssignRoleForm({ systemRole: 'Employee', businessWallet: '0', personalWallet: '0' });
          setSelectedPermissions([]);
        }}
      />
    </div>
  );
}