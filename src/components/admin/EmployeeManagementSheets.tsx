import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Card } from '../ui/card';
import { User, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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

const rolePermissions = {
  Admin: {
    label: 'Admin',
    description: 'Full access to all features',
    icon: Shield,
    permissions: ['All Features', 'User Management', 'Finance', 'Analytics', 'Settings']
  },
  Manager: {
    label: 'Manager',
    description: 'Manage approvals, employees, and view analytics',
    icon: Shield,
    permissions: ['Approvals', 'Employees', 'Analytics', 'Reports']
  },
  Finance: {
    label: 'Finance',
    description: 'Access only Finance & Expenses section',
    icon: Shield,
    permissions: ['Expense Claims', 'Expense Policies', 'Reimbursements', 'Finance Reports']
  },
  HR: {
    label: 'HR',
    description: 'Manage employees, policies, and settings',
    icon: Shield,
    permissions: ['Employees', 'Policies', 'Settings', 'User Management']
  },
  Employee: {
    label: 'Employee',
    description: 'Standard employee access',
    icon: User,
    permissions: ['Book Travel', 'Submit Expenses', 'View Own Data']
  }
};

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

const permissionCategories = {
  'Admin': allPermissions.filter(p => p.category === 'Admin'),
  'Management': allPermissions.filter(p => p.category === 'Management'),
  'Reports': allPermissions.filter(p => p.category === 'Reports'),
  'Finance': allPermissions.filter(p => p.category === 'Finance'),
  'HR': allPermissions.filter(p => p.category === 'HR'),
  'Employee': allPermissions.filter(p => p.category === 'Employee'),
};

interface AddEmployeeBasicSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  basicEmployeeForm: {
    name: string;
    email: string;
    phone: string;
    department: string;
    jobRole: string;
    address: string;
  };
  setBasicEmployeeForm: (form: any) => void;
  onSave: () => void;
}

export function AddEmployeeBasicSheet({ 
  open, 
  onOpenChange, 
  basicEmployeeForm, 
  setBasicEmployeeForm,
  onSave
}: AddEmployeeBasicSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Add Employee to Company Directory</SheetTitle>
          <SheetDescription>
            Add employee's basic information to your company directory
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 py-6 space-y-5">
          {/* Info Banner */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900 mb-1">Employee Directory Only</p>
                <p className="text-xs text-blue-700">
                  This adds the employee to your company directory with basic information. 
                  Use "Assign Role to Existing" later to give them SimplifyMove access.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm text-gray-900">Employee Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  placeholder="John Doe"
                  value={basicEmployeeForm.name}
                  onChange={(e) => setBasicEmployeeForm({ ...basicEmployeeForm, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  placeholder="john@acme.com"
                  value={basicEmployeeForm.email}
                  onChange={(e) => setBasicEmployeeForm({ ...basicEmployeeForm, email: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <Input
                  placeholder="+91 98765 43210"
                  value={basicEmployeeForm.phone}
                  onChange={(e) => setBasicEmployeeForm({ ...basicEmployeeForm, phone: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Department *</Label>
                <Select value={basicEmployeeForm.department} onValueChange={(value) => setBasicEmployeeForm({ ...basicEmployeeForm, department: value })}>
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
                  value={basicEmployeeForm.jobRole}
                  onChange={(e) => setBasicEmployeeForm({ ...basicEmployeeForm, jobRole: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div className="col-span-2">
                <Label>Address</Label>
                <Input
                  placeholder="City, State, Country"
                  value={basicEmployeeForm.address}
                  onChange={(e) => setBasicEmployeeForm({ ...basicEmployeeForm, address: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            <User className="w-4 h-4 mr-2" />
            Add to Directory
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface AssignRoleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: UserData[];
  selectedEmployeeId: number | null;
  setSelectedEmployeeId: (id: number | null) => void;
  assignRoleForm: {
    systemRole: UserData['systemRole'];
    businessWallet: string;
    personalWallet: string;
  };
  setAssignRoleForm: (form: any) => void;
  selectedPermissions: string[];
  setSelectedPermissions: (perms: string[]) => void;
  onSave: () => void;
}

export function AssignRoleSheet({
  open,
  onOpenChange,
  users,
  selectedEmployeeId,
  setSelectedEmployeeId,
  assignRoleForm,
  setAssignRoleForm,
  selectedPermissions,
  setSelectedPermissions,
  onSave
}: AssignRoleSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Assign SimplifyMove Role</SheetTitle>
          <SheetDescription>
            Select an existing employee and assign SimplifyMove access role
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 py-6 space-y-5">
          {/* Employee Selection */}
          <div>
            <Label>Select Employee *</Label>
            <Select 
              value={selectedEmployeeId?.toString() || ''} 
              onValueChange={(value) => {
                const employeeId = parseInt(value);
                setSelectedEmployeeId(employeeId);
                const employee = users.find(u => u.id === employeeId);
                if (employee) {
                  setAssignRoleForm({
                    systemRole: employee.systemRole,
                    businessWallet: employee.businessWallet.toString(),
                    personalWallet: employee.personalWallet.toString(),
                  });
                  setSelectedPermissions(employee.permissions);
                }
              }}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose an employee..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} • {user.email} • {user.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEmployeeId && (
            <>
              {/* Selected Employee Info */}
              <Card className="p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{users.find(u => u.id === selectedEmployeeId)?.name}</p>
                    <p className="text-xs text-gray-600">{users.find(u => u.id === selectedEmployeeId)?.email}</p>
                    <p className="text-xs text-gray-600">
                      {users.find(u => u.id === selectedEmployeeId)?.department} • {users.find(u => u.id === selectedEmployeeId)?.jobRole}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Divider */}
              <div className="border-t"></div>

              {/* System Role Selection */}
              <div>
                <h3 className="text-sm text-gray-900 mb-4">SimplifyMove Access & Role</h3>
                <Label>System Role *</Label>
                <Select 
                  value={assignRoleForm.systemRole} 
                  onValueChange={(value) => {
                    setAssignRoleForm({ ...assignRoleForm, systemRole: value as UserData['systemRole'] });
                    setSelectedPermissions(rolePermissions[value as keyof typeof rolePermissions].permissions);
                  }}
                >
                  <SelectTrigger className="mt-2 h-auto py-3 [&>span]:w-full [&>span]:flex [&>span]:items-start">
                    <SelectValue>
                      <div className="flex items-start gap-2 w-full">
                        {(() => {
                          const Icon = rolePermissions[assignRoleForm.systemRole].icon;
                          return <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />;
                        })()}
                        <div className="flex-1 text-left">
                          <p className="text-sm leading-tight">{rolePermissions[assignRoleForm.systemRole].label}</p>
                          <p className="text-xs text-gray-500 leading-tight">{rolePermissions[assignRoleForm.systemRole].description}</p>
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
                                id={`assign-${perm.id}`}
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
                                htmlFor={`assign-${perm.id}`}
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
                      value={assignRoleForm.businessWallet}
                      onChange={(e) => setAssignRoleForm({ ...assignRoleForm, businessWallet: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Personal Wallet</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={assignRoleForm.personalWallet}
                      onChange={(e) => setAssignRoleForm({ ...assignRoleForm, personalWallet: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!selectedEmployeeId}>
            <Shield className="w-4 h-4 mr-2" />
            Assign Role
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
