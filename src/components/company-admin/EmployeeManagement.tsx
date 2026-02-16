import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Loader,
  ChevronDown,
  Search,
  Upload,
  Download,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  walletBalance?: number;
  _id?: string;
}

interface AddEmployeeForm {
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
}

interface ImportPreviewData {
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  isValid: boolean;
  errors: string[];
}

export function EmployeeManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreviewData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [walletRefreshTrigger, setWalletRefreshTrigger] = useState(0);
  const [newEmployee, setNewEmployee] = useState<AddEmployeeForm>({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: 'Developer',
  });

  // Fetch employees from backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch wallet balances when component loads or refresh is triggered
  useEffect(() => {
    if (employees.length > 0) {
      fetchWalletBalances();
    }
  }, [walletRefreshTrigger]);

  // Listen for wallet update events from other components
  useEffect(() => {
    const handleWalletUpdate = () => {
      setWalletRefreshTrigger(prev => prev + 1);
    };
    window.addEventListener('walletUpdated', handleWalletUpdate);
    return () => window.removeEventListener('walletUpdated', handleWalletUpdate);
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/v1/companyAdmins/employees', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const empData = data.data || [];
        setEmployees(empData);
        // Fetch wallet balances for all employees
        await fetchWalletBalancesForEmployees(empData);
      } else {
        // For demo purposes, show mock data if API not available
        setEmployees([
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@company.com',
            phone: '+91-9876543210',
            department: 'Engineering',
            designation: 'Senior Developer',
            status: 'active',
            joinDate: '2023-01-15',
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@company.com',
            phone: '+91-9876543211',
            department: 'Finance',
            designation: 'Financial Analyst',
            status: 'active',
            joinDate: '2023-03-20',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
      // Show mock data as fallback
      setEmployees([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@company.com',
          phone: '+91-9876543210',
          department: 'Engineering',
          designation: 'Senior Developer',
          status: 'active',
          joinDate: '2023-01-15',
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          phone: '+91-9876543211',
          department: 'Finance',
          designation: 'Financial Analyst',
          status: 'active',
          joinDate: '2023-03-20',
        },
      ]);
    } finally {
      setLoading(false);
    }
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
    const requiredHeaders = ['name', 'email', 'phone', 'department', 'designation'];
    
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
      if (!row.designation) errors.push('Designation is required');

      // Check duplicate email
      if (employees.some(e => e.email.toLowerCase() === row.email.toLowerCase())) {
        errors.push('Email already exists');
      }

      preview.push({
        name: row.name,
        email: row.email,
        phone: row.phone,
        department: row.department,
        designation: row.designation,
        isValid: errors.length === 0,
        errors
      });
    }

    setImportPreview(preview);
    setShowImportPreview(true);
  };

  const handleConfirmImport = async () => {
    const validRows = importPreview.filter(row => row.isValid);
    
    if (validRows.length === 0) {
      toast.error('No valid rows to import');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      let successCount = 0;
      let failureCount = 0;

      for (const row of validRows) {
        try {
          const response = await fetch('http://localhost:5001/api/v1/companyAdmins/employees', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: row.name,
              email: row.email,
              phone: row.phone,
              department: row.department,
              designation: row.designation,
              password: 'TempPassword123!',
            }),
          });

          if (response.ok) {
            successCount++;
          } else {
            failureCount++;
          }
        } catch (err) {
          failureCount++;
        }
      }

      // Refresh employee list
      await fetchEmployees();

      toast.success(
        `Imported ${successCount} employees successfully${
          failureCount > 0 ? `. Failed: ${failureCount}` : ''
        }`
      );
      setShowImportPreview(false);
      setImportPreview([]);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import employees');
    }
  };

  const downloadTemplate = () => {
    const template = `name,email,phone,department,designation
John Doe,john@company.com,+91 9876543210,Engineering,Senior Developer
Jane Smith,jane@company.com,+91 9876543211,Finance,Financial Analyst
Mike Johnson,mike@company.com,+91 9876543212,Sales,Sales Manager`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee_import_template_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully');
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/v1/companyAdmins/employees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEmployee,
          password: 'TempPassword123!', // Default temp password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // The API returns data in data.data property
        const newEmp = data.data || data;
        const employee: Employee = {
          id: newEmp._id || newEmp.id,
          name: newEmp.name,
          email: newEmp.email,
          phone: newEmp.phone || '',
          department: newEmp.department || '',
          designation: newEmp.designation || '',
          status: newEmp.status || 'active',
          joinDate: new Date().toISOString().split('T')[0],
        };
        setEmployees([...employees, employee]);
        setOpenAddDialog(false);
        setNewEmployee({
          name: '',
          email: '',
          phone: '',
          department: 'Engineering',
          designation: 'Developer',
        });
        toast.success('Employee added successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Failed to add employee');
    }
  };

  const handleDeactivateEmployee = async (employeeId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5001/api/v1/companyAdmins/employees/${employeeId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setEmployees(
          employees.map((emp) =>
            emp.id === employeeId ? { ...emp, status: 'inactive' } : emp
          )
        );
        toast.success('Employee deactivated successfully');
      } else {
        toast.error('Failed to deactivate employee');
      }
    } catch (error) {
      console.error('Error deactivating employee:', error);
      toast.error('Failed to deactivate employee');
    }
  };

  const fetchWalletBalances = async () => {
    if (employees.length === 0) return;
    await fetchWalletBalancesForEmployees(employees);
  };

  const fetchWalletBalancesForEmployees = async (empList: Employee[]) => {
    try {
      const token = localStorage.getItem('token');
      const companyId = localStorage.getItem('companyId');

      if (!companyId) return;

      // Fetch wallet summary which includes all employee wallet balances
      const response = await fetch(`http://localhost:5001/api/v1/wallets/company/${companyId}/summary`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const employeeWallets = data.data.employeeWallets || [];

        // Create a map of employee ID to wallet balance
        const walletMap = new Map();
        employeeWallets.forEach((ew: any) => {
          walletMap.set(ew.employeeId, parseFloat(ew.walletBalance) || 0);
        });

        // Update employees with wallet balances
        const updatedEmployees = empList.map(emp => ({
          ...emp,
          walletBalance: walletMap.get(emp.id || emp._id) || 0
        }));
        setEmployees(updatedEmployees);
      }
    } catch (error) {
      console.error('Error fetching wallet balances:', error);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your company's employees and their roles
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={downloadTemplate}
            title="Download CSV template for bulk import"
          >
            <Download className="w-4 h-4 mr-2" />
            Template
          </Button>
          <Button 
            variant="outline" 
            onClick={handleImportClick}
            title="Upload CSV file to bulk add employees"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Bulk
          </Button>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="john@company.com"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  type="tel"
                  placeholder="+91-9876543210"
                  value={newEmployee.phone}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <Input
                  type="text"
                  placeholder="Engineering"
                  value={newEmployee.department}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, department: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <Input
                  type="text"
                  placeholder="Senior Developer"
                  value={newEmployee.designation}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, designation: e.target.value })
                  }
                />
              </div>
              <Button
                onClick={handleAddEmployee}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Add Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search employees by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Employees Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">
              {searchTerm ? 'No employees found' : 'No employees yet'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {!searchTerm && 'Add your first employee to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Wallet Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-600">
                        ₹{(employee.walletBalance || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status.charAt(0).toUpperCase() +
                          employee.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(employee.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {employee.status === 'active' && (
                            <DropdownMenuItem
                              onClick={() => handleDeactivateEmployee(employee.id)}
                              className="text-red-600"
                            >
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Import Preview Dialog */}
      <Dialog open={showImportPreview} onOpenChange={setShowImportPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Import Preview</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <div className="space-y-4 p-4">
              {importPreview.length === 0 ? (
                <p className="text-gray-600">No data to import</p>
              ) : (
                <div className="space-y-2">
                  {importPreview.map((row, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 ${
                        row.isValid
                          ? 'border-green-300 bg-green-50'
                          : 'border-red-300 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{row.name}</p>
                          <p className="text-sm text-gray-600">{row.email}</p>
                          <p className="text-sm text-gray-600">
                            {row.department} - {row.designation}
                          </p>
                        </div>
                        {row.isValid ? (
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                        )}
                      </div>
                      {row.errors.length > 0 && (
                        <div className="text-sm text-red-600 space-y-1">
                          {row.errors.map((error, i) => (
                            <p key={i}>• {error}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Valid rows: {importPreview.filter(r => r.isValid).length} /{' '}
              {importPreview.length}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowImportPreview(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmImport}
                disabled={
                  importPreview.filter(r => r.isValid).length === 0
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                Import {importPreview.filter(r => r.isValid).length} Employees
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
