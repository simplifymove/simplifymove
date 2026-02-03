import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Crown,
  Key,
  User
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'admin' | 'support';
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
  createdDate: string;
  lastLogin: string;
  lastLoginIP: string;
  loginAttempts: number;
  twoFactorEnabled: boolean;
}

const mockSuperAdmins: SuperAdminUser[] = [
  {
    id: 'SA-001',
    name: 'System Administrator',
    email: 'admin@simplifymove.com',
    phone: '+91-9876543210',
    role: 'super_admin',
    status: 'active',
    permissions: ['All Permissions', 'Company Management', 'User Management', 'Billing', 'System Config', 'Analytics', 'Audit Logs'],
    createdDate: '2024-01-01',
    lastLogin: '2024-12-24 10:30 AM',
    lastLoginIP: '192.168.1.100',
    loginAttempts: 0,
    twoFactorEnabled: true,
  },
  {
    id: 'SA-002',
    name: 'Raghava Boyidi',
    email: 'raghava@simplifymove.com',
    phone: '+91-9876543211',
    role: 'super_admin',
    status: 'active',
    permissions: ['All Permissions', 'Company Management', 'User Management', 'Billing', 'System Config', 'Analytics', 'Audit Logs'],
    createdDate: '2024-01-05',
    lastLogin: '2024-12-24 09:15 AM',
    lastLoginIP: '192.168.1.101',
    loginAttempts: 0,
    twoFactorEnabled: true,
  },
  {
    id: 'SA-003',
    name: 'Support Manager',
    email: 'support@simplifymove.com',
    phone: '+91-9876543212',
    role: 'support',
    status: 'active',
    permissions: ['View Companies', 'Support Tickets', 'Analytics', 'Audit Logs'],
    createdDate: '2024-02-10',
    lastLogin: '2024-12-23 05:45 PM',
    lastLoginIP: '192.168.1.102',
    loginAttempts: 0,
    twoFactorEnabled: false,
  },
  {
    id: 'SA-004',
    name: 'Platform Admin',
    email: 'platformadmin@simplifymove.com',
    phone: '+91-9876543213',
    role: 'admin',
    status: 'active',
    permissions: ['Company Management', 'User Management', 'Analytics', 'Audit Logs'],
    createdDate: '2024-03-15',
    lastLogin: '2024-12-23 02:30 PM',
    lastLoginIP: '192.168.1.103',
    loginAttempts: 0,
    twoFactorEnabled: true,
  },
  {
    id: 'SA-005',
    name: 'Former Admin',
    email: 'former@simplifymove.com',
    phone: '+91-9876543214',
    role: 'admin',
    status: 'inactive',
    permissions: ['Company Management', 'Analytics'],
    createdDate: '2024-01-20',
    lastLogin: '2024-11-15 04:00 PM',
    lastLoginIP: '192.168.1.104',
    loginAttempts: 0,
    twoFactorEnabled: false,
  },
];

export function SuperAdminUserManagementClean() {
  const [users, setUsers] = useState<SuperAdminUser[]>(mockSuperAdmins);
  const [selectedUser, setSelectedUser] = useState<SuperAdminUser | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form state
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin' as const,
    status: 'active' as const,
    twoFactorEnabled: false,
  });

  // Reset form
  const resetForm = () => {
    setUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'admin',
      status: 'active',
      twoFactorEnabled: false,
    });
  };

  // Get permissions based on role
  const getPermissionsByRole = (role: string): string[] => {
    switch (role) {
      case 'super_admin':
        return ['All Permissions', 'Company Management', 'User Management', 'Billing', 'System Config', 'Analytics', 'Audit Logs'];
      case 'admin':
        return ['Company Management', 'User Management', 'Analytics', 'Audit Logs'];
      case 'support':
        return ['View Companies', 'Support Tickets', 'Analytics', 'Audit Logs'];
      default:
        return [];
    }
  };

  // Add user
  const handleAddUser = () => {
    if (!userForm.name || !userForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newUser: SuperAdminUser = {
      id: `SA-${String(users.length + 1).padStart(3, '0')}`,
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      role: userForm.role,
      status: userForm.status,
      permissions: getPermissionsByRole(userForm.role),
      createdDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
      lastLoginIP: '-',
      loginAttempts: 0,
      twoFactorEnabled: userForm.twoFactorEnabled,
    };

    setUsers([newUser, ...users]);
    toast.success('Super admin user created successfully!');
    setShowAddDialog(false);
    resetForm();
  };

  // Edit user
  const handleEditClick = (user: SuperAdminUser) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled,
    });
    setShowEditDialog(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    if (!userForm.name || !userForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUsers(users.map(u =>
      u.id === selectedUser.id
        ? {
            ...u,
            name: userForm.name,
            email: userForm.email,
            phone: userForm.phone,
            role: userForm.role,
            status: userForm.status,
            permissions: getPermissionsByRole(userForm.role),
            twoFactorEnabled: userForm.twoFactorEnabled,
          }
        : u
    ));

    toast.success('User updated successfully!');
    setShowEditDialog(false);
    setSelectedUser(null);
    resetForm();
  };

  // Delete user
  const handleDeleteClick = (user: SuperAdminUser) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;

    setUsers(users.filter(u => u.id !== selectedUser.id));
    toast.success('User deleted successfully');
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  // Toggle status
  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' as const }
        : u
    ));
    toast.success('User status updated');
  };

  // Reset password
  const handleResetPassword = (user: SuperAdminUser) => {
    toast.success(`Password reset email sent to ${user.email}`);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'suspended': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return { bg: 'bg-purple-100', text: 'text-purple-600', icon: Crown };
      case 'admin': return { bg: 'bg-blue-100', text: 'text-blue-600', icon: Shield };
      case 'support': return { bg: 'bg-green-100', text: 'text-green-600', icon: User };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', icon: User };
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;

    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const activeCount = users.filter(u => u.status === 'active').length;
  const superAdminCount = users.filter(u => u.role === 'super_admin').length;
  const twoFactorCount = users.filter(u => u.twoFactorEnabled).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Users</h1>
              <p className="text-gray-600 mt-1">Manage platform administrators and their permissions</p>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Admin User
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-600">{activeCount}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Super Admins</p>
                  <p className="text-3xl font-bold text-purple-600">{superAdminCount}</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Crown className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">2FA Enabled</p>
                  <p className="text-3xl font-bold text-gray-900">{twoFactorCount}</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Key className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="support">Support</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {filteredUsers.length === 0 ? (
          <Card className="p-12 text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredUsers.map((user) => {
              const roleColor = getRoleColor(user.role);
              const RoleIcon = roleColor.icon;

              return (
                <Card key={user.id} className="p-6 border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-[#000035] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900">{user.name}</h3>
                            <Badge variant="outline" className={getStatusColor(user.status)}>
                              {user.status === 'active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                              {user.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className={`${roleColor.bg} ${roleColor.text} border-0`}>
                              <RoleIcon className="w-3 h-3 mr-1" />
                              {user.role.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {user.twoFactorEnabled && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Key className="w-3 h-3 mr-1" />
                                2FA
                              </Badge>
                            )}
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-2 text-sm mb-3">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>

                          {/* Last Login Info */}
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <p className="text-gray-600">Last Login</p>
                                <p className="font-semibold">{user.lastLogin}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">IP Address</p>
                                <p className="font-semibold">{user.lastLoginIP}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Created</p>
                                <p className="font-semibold">{user.createdDate}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">User ID</p>
                                <p className="font-semibold">{user.id}</p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowViewDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResetPassword(user)}
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(user)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleToggleStatus(user.id)}
                              className={user.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                            >
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit User Dialog (Combined) */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setShowEditDialog(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{showAddDialog ? 'Add New Admin User' : 'Edit Admin User'}</DialogTitle>
            <DialogDescription>
              {showAddDialog ? 'Create a new administrator account' : 'Update administrator information'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user-name">Full Name *</Label>
                <Input
                  id="user-name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="mt-2"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="user-email">Email *</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="mt-2"
                  placeholder="email@simplifymove.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user-phone">Phone</Label>
                <Input
                  id="user-phone"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  className="mt-2"
                  placeholder="+91-9876543210"
                />
              </div>
              <div>
                <Label htmlFor="user-role">Role *</Label>
                <select
                  id="user-role"
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                  className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="support">Support</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user-status">Status *</Label>
                <select
                  id="user-status"
                  value={userForm.status}
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value as any })}
                  className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex items-center mt-8">
                <input
                  type="checkbox"
                  id="two-factor"
                  checked={userForm.twoFactorEnabled}
                  onChange={(e) => setUserForm({ ...userForm, twoFactorEnabled: e.target.checked })}
                  className="w-4 h-4 text-[#000035] border-gray-300 rounded"
                />
                <Label htmlFor="two-factor" className="ml-2">
                  Enable Two-Factor Authentication
                </Label>
              </div>
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold mb-2 text-sm">Permissions for {userForm.role.replace('_', ' ').toUpperCase()}</h3>
              <div className="flex flex-wrap gap-2">
                {getPermissionsByRole(userForm.role).map((permission, idx) => (
                  <Badge key={idx} variant="outline" className="bg-white text-blue-700 border-blue-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {permission}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setShowEditDialog(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button
              onClick={showAddDialog ? handleAddUser : handleUpdateUser}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              {showAddDialog ? 'Add User' : 'Update User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#000035] rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2>{selectedUser.name}</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedUser.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Complete user information and permissions
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(selectedUser.status)}>
                    {selectedUser.status === 'active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {selectedUser.status}
                  </Badge>
                  <Badge variant="outline" className={`${getRoleColor(selectedUser.role).bg} ${getRoleColor(selectedUser.role).text} border-0`}>
                    {(() => {
                      const Icon = getRoleColor(selectedUser.role).icon;
                      return <Icon className="w-3 h-3 mr-1" />;
                    })()}
                    {selectedUser.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {selectedUser.twoFactorEnabled && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Key className="w-3 h-3 mr-1" />
                      2FA Enabled
                    </Badge>
                  )}
                </div>

                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span>{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span>{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Account Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Created Date</p>
                      <p className="font-semibold">{selectedUser.createdDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Login</p>
                      <p className="font-semibold">{selectedUser.lastLogin}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last IP</p>
                      <p className="font-semibold">{selectedUser.lastLoginIP}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Login Attempts</p>
                      <p className="font-semibold">{selectedUser.loginAttempts}</p>
                    </div>
                  </div>
                </Card>

                <div>
                  <h3 className="font-semibold mb-3">Permissions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.permissions.map((permission, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Admin User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this administrator? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedUser.email} • {selectedUser.role.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}