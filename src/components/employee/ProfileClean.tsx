import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  User, 
  Mail, 
  Phone, 
  Building,
  MapPin,
  CreditCard,
  Users,
  Settings,
  Bell,
  Camera,
  Check,
  Plus,
  Trash2,
  Shield,
  Edit2,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ProfileClean() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Personal Info State
  const [profileData, setProfileData] = useState({
    firstName: 'Raghava',
    lastName: 'Boyidi',
    email: 'raghavaboyidi@simplifymove.com',
    phone: '+91 98765 43210',
    company: 'SimplifyMove Pvt Ltd',
    department: 'Technology',
    employeeId: 'EMP-2025-001',
    dob: '1990-05-15',
  });

  // Addresses State
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Office', address: '123 Business Park, Downtown, Mumbai - 400001', type: 'Work' },
    { id: 2, label: 'Home', address: '456 Residential Complex, Suburbs, Mumbai - 400067', type: 'Home' },
  ]);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [newAddress, setNewAddress] = useState({ label: '', address: '', type: 'Home' });

  // Travelers State
  const [travelers, setTravelers] = useState([
    { id: 1, name: 'John Doe', relation: 'Colleague', email: 'john@company.com', phone: '+91 98765 43210' },
    { id: 2, name: 'Jane Smith', relation: 'Family', email: 'jane@email.com', phone: '+91 98765 43211' },
  ]);
  const [showTravelerDialog, setShowTravelerDialog] = useState(false);
  const [editingTraveler, setEditingTraveler] = useState<any>(null);
  const [newTraveler, setNewTraveler] = useState({ name: '', relation: 'Colleague', email: '', phone: '' });

  // Payment Methods State
  const [payments, setPayments] = useState([
    { id: 1, type: 'Credit Card', last4: '4242', expiry: '12/25', brand: 'Visa' },
    { id: 2, type: 'Debit Card', last4: '5555', expiry: '06/26', brand: 'Mastercard' },
  ]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({ type: 'Credit Card', cardNumber: '', expiry: '', cvv: '', brand: 'Visa' });

  // Preferences State
  const [preferences, setPreferences] = useState({
    bookingUpdates: true,
    emailNotifications: true,
    securityAlerts: true,
  });

  // Handle Profile Save
  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  // Address Operations
  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    const address = { ...newAddress, id: Date.now() };
    setAddresses([...addresses, address]);
    setNewAddress({ label: '', address: '', type: 'Home' });
    setShowAddressDialog(false);
    toast.success('Address added successfully!');
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setNewAddress(address);
    setShowAddressDialog(true);
  };

  const handleUpdateAddress = () => {
    if (!newAddress.label || !newAddress.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    setAddresses(addresses.map(a => a.id === editingAddress.id ? { ...newAddress, id: a.id } : a));
    setEditingAddress(null);
    setNewAddress({ label: '', address: '', type: 'Home' });
    setShowAddressDialog(false);
    toast.success('Address updated successfully!');
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success('Address deleted successfully!');
  };

  // Traveler Operations
  const handleAddTraveler = () => {
    if (!newTraveler.name || !newTraveler.email || !newTraveler.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    const traveler = { ...newTraveler, id: Date.now() };
    setTravelers([...travelers, traveler]);
    setNewTraveler({ name: '', relation: 'Colleague', email: '', phone: '' });
    setShowTravelerDialog(false);
    toast.success('Co-traveler added successfully!');
  };

  const handleEditTraveler = (traveler: any) => {
    setEditingTraveler(traveler);
    setNewTraveler(traveler);
    setShowTravelerDialog(true);
  };

  const handleUpdateTraveler = () => {
    if (!newTraveler.name || !newTraveler.email || !newTraveler.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setTravelers(travelers.map(t => t.id === editingTraveler.id ? { ...newTraveler, id: t.id } : t));
    setEditingTraveler(null);
    setNewTraveler({ name: '', relation: 'Colleague', email: '', phone: '' });
    setShowTravelerDialog(false);
    toast.success('Co-traveler updated successfully!');
  };

  const handleDeleteTraveler = (id: number) => {
    setTravelers(travelers.filter(t => t.id !== id));
    toast.success('Co-traveler deleted successfully!');
  };

  // Payment Operations
  const handleAddPayment = () => {
    if (!newPayment.cardNumber || !newPayment.expiry || !newPayment.cvv) {
      toast.error('Please fill in all required fields');
      return;
    }
    const payment = { 
      id: Date.now(), 
      type: newPayment.type, 
      last4: newPayment.cardNumber.slice(-4), 
      expiry: newPayment.expiry, 
      brand: newPayment.brand 
    };
    setPayments([...payments, payment]);
    setNewPayment({ type: 'Credit Card', cardNumber: '', expiry: '', cvv: '', brand: 'Visa' });
    setShowPaymentDialog(false);
    toast.success('Payment method added successfully!');
  };

  const handleDeletePayment = (id: number) => {
    setPayments(payments.filter(p => p.id !== id));
    toast.success('Payment method deleted successfully!');
  };

  // Preferences Operations
  const handleTogglePreference = (key: string) => {
    setPreferences({ ...preferences, [key]: !preferences[key as keyof typeof preferences] });
    toast.success('Preferences updated!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Header Card */}
        <Card className="p-6 border-gray-200">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-[#000035] rounded-full flex items-center justify-center text-white text-3xl font-semibold shadow-lg">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{profileData.firstName} {profileData.lastName}</h3>
                  <p className="text-gray-600 mb-3">{profileData.email}</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#000035] border-0">
                      <Building className="w-3 h-3 mr-1" />
                      Business User
                    </Badge>
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
                <Button 
                  className={isEditing 
                    ? 'bg-[#000035] hover:bg-[#000055]' 
                    : 'border-gray-200'
                  }
                  variant={isEditing ? 'default' : 'outline'}
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="bg-gray-100 mb-6">
            <TabsTrigger value="personal" className="data-[state=active]:bg-white">
              <User className="w-4 h-4 mr-2" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:bg-white">
              <MapPin className="w-4 h-4 mr-2" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="travelers" className="data-[state=active]:bg-white">
              <Users className="w-4 h-4 mr-2" />
              Co-Travelers
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-white">
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    value={profileData.firstName}
                    disabled={!isEditing}
                    className="border-gray-200"
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    value={profileData.lastName}
                    disabled={!isEditing}
                    className="border-gray-200"
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled={!isEditing}
                      className="border-gray-200"
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                    <Badge className="bg-green-50 text-green-700 border-green-200 flex-shrink-0">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    disabled={!isEditing}
                    className="border-gray-200"
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    disabled={!isEditing}
                    className="border-gray-200"
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    disabled={!isEditing}
                    className="border-gray-200"
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-id">Employee ID</Label>
                  <Input
                    id="employee-id"
                    value={profileData.employeeId}
                    disabled
                    className="border-gray-200 bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={profileData.dob}
                    disabled={!isEditing}
                    className="border-gray-200"
                    onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Saved Addresses */}
          <TabsContent value="addresses">
            <div className="space-y-4">
              {addresses.map((address) => (
                <Card key={address.id} className="p-6 border-gray-200 hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-[#000035]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{address.label}</h4>
                          <Badge variant="outline" className="border-gray-200 text-gray-600">
                            {address.type}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{address.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditAddress(address)}
                      >
                        <Edit2 className="w-4 h-4 text-[#000035]" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              <Button className="w-full bg-[#000035] hover:bg-[#000055]" onClick={() => setShowAddressDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            </div>
          </TabsContent>

          {/* Co-Travelers */}
          <TabsContent value="travelers">
            <div className="space-y-4">
              {travelers.map((traveler) => (
                <Card key={traveler.id} className="p-6 border-gray-200 hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-[#000035]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{traveler.name}</h4>
                          <Badge variant="outline" className="border-gray-200 text-gray-600">
                            {traveler.relation}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {traveler.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {traveler.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditTraveler(traveler)}
                      >
                        <Edit2 className="w-4 h-4 text-[#000035]" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTraveler(traveler.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              <Button className="w-full bg-[#000035] hover:bg-[#000055]" onClick={() => setShowTravelerDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Co-Traveler
              </Button>
            </div>
          </TabsContent>

          {/* Payment Methods */}
          <TabsContent value="payment">
            <div className="space-y-4">
              {payments.map((method) => (
                <Card key={method.id} className="p-6 border-gray-200 hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-[#000035]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{method.type}</h4>
                          <Badge variant="outline" className="border-gray-200 text-gray-600">
                            {method.brand}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>•••• •••• •••• {method.last4}</span>
                          <span>Expires {method.expiry}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeletePayment(method.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Button className="w-full bg-[#000035] hover:bg-[#000055]" onClick={() => setShowPaymentDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-[#000035]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Booking Updates</p>
                      <p className="text-sm text-gray-600">Get notified about booking confirmations and changes</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.bookingUpdates} 
                    onChange={() => handleTogglePreference('bookingUpdates')} 
                    className="w-5 h-5" 
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#000035]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive email updates for important events</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.emailNotifications} 
                    onChange={() => handleTogglePreference('emailNotifications')} 
                    className="w-5 h-5" 
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#000035]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Security Alerts</p>
                      <p className="text-sm text-gray-600">Get alerts for security and account activity</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.securityAlerts} 
                    onChange={() => handleTogglePreference('securityAlerts')} 
                    className="w-5 h-5" 
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={(open) => {
        setShowAddressDialog(open);
        if (!open) {
          setEditingAddress(null);
          setNewAddress({ label: '', address: '', type: 'Home' });
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            <DialogDescription>
              {editingAddress ? 'Update your address details' : 'Enter the new address details'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="address-label">Label *</Label>
              <Input
                id="address-label"
                placeholder="e.g., Home, Office"
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                className="border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter full address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                className="border-gray-200"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-type">Type *</Label>
              <Select
                value={newAddress.type}
                onValueChange={(value) => setNewAddress({ ...newAddress, type: value })}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddressDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#000035] hover:bg-[#000055]"
              onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
            >
              {editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Traveler Dialog */}
      <Dialog open={showTravelerDialog} onOpenChange={(open) => {
        setShowTravelerDialog(open);
        if (!open) {
          setEditingTraveler(null);
          setNewTraveler({ name: '', relation: 'Colleague', email: '', phone: '' });
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTraveler ? 'Edit Co-Traveler' : 'Add New Co-Traveler'}</DialogTitle>
            <DialogDescription>
              {editingTraveler ? 'Update your co-traveler details' : 'Enter the new co-traveler details'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="traveler-name">Name *</Label>
              <Input
                id="traveler-name"
                placeholder="Full name"
                value={newTraveler.name}
                onChange={(e) => setNewTraveler({ ...newTraveler, name: e.target.value })}
                className="border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="traveler-relation">Relation *</Label>
              <Select
                value={newTraveler.relation}
                onValueChange={(value) => setNewTraveler({ ...newTraveler, relation: value })}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Colleague">Colleague</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="traveler-email">Email *</Label>
              <Input
                id="traveler-email"
                type="email"
                placeholder="email@example.com"
                value={newTraveler.email}
                onChange={(e) => setNewTraveler({ ...newTraveler, email: e.target.value })}
                className="border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="traveler-phone">Phone *</Label>
              <Input
                id="traveler-phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={newTraveler.phone}
                onChange={(e) => setNewTraveler({ ...newTraveler, phone: e.target.value })}
                className="border-gray-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTravelerDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#000035] hover:bg-[#000055]"
              onClick={editingTraveler ? handleUpdateTraveler : handleAddTraveler}
            >
              {editingTraveler ? 'Update Co-Traveler' : 'Add Co-Traveler'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={(open) => {
        setShowPaymentDialog(open);
        if (!open) {
          setNewPayment({ type: 'Credit Card', cardNumber: '', expiry: '', cvv: '', brand: 'Visa' });
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Payment Method</DialogTitle>
            <DialogDescription>
              Enter your payment card details securely
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-type">Card Type *</Label>
              <Select
                value={newPayment.type}
                onValueChange={(value) => setNewPayment({ ...newPayment, type: value })}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Debit Card">Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-brand">Card Brand *</Label>
              <Select
                value={newPayment.brand}
                onValueChange={(value) => setNewPayment({ ...newPayment, brand: value })}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visa">Visa</SelectItem>
                  <SelectItem value="Mastercard">Mastercard</SelectItem>
                  <SelectItem value="Amex">American Express</SelectItem>
                  <SelectItem value="Rupay">RuPay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number *</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={newPayment.cardNumber}
                onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value.replace(/\s/g, '') })}
                className="border-gray-200"
                maxLength={16}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date *</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={newPayment.expiry}
                  onChange={(e) => setNewPayment({ ...newPayment, expiry: e.target.value })}
                  className="border-gray-200"
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  value={newPayment.cvv}
                  onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value })}
                  className="border-gray-200"
                  maxLength={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#000035] hover:bg-[#000055]"
              onClick={handleAddPayment}
            >
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
