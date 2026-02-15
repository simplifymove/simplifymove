import { useState, useEffect } from 'react';
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
}

interface AddEmployeeForm {
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
        setEmployees(data.data || []);
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
    </div>
  );
}
