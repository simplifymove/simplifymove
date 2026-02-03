import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Package,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  IndianRupee,
  Truck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  PackageCheck,
  PackageX,
  PackageOpen,
  Home,
  Building2,
  Zap,
  Shield,
  Calculator,
  Box,
  Ruler,
  Weight,
  Banknote,
  Bell,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CourierBooking {
  id: string;
  trackingNumber: string;
  serviceType: string;
  serviceProvider: string;
  packageType: string;
  weight: number;
  volumetricWeight?: number;
  dimensions?: { length: number; width: number; height: number };
  pickupAddress: string;
  deliveryAddress: string;
  pickupPincode: string;
  deliveryPincode: string;
  pickupDate: string;
  pickupTime: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  description: string;
  declaredValue: number;
  estimatedCost: number;
  codAmount?: number;
  insuranceValue?: number;
  status: 'pending' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'failed-delivery';
  estimatedDelivery?: string;
  createdAt: string;
}

// Based on DTDC and Blue Dart services
const courierServices = [
  {
    id: 'express',
    provider: 'Blue Dart',
    name: 'Express Domestic',
    description: 'Next day delivery to major cities',
    icon: Zap,
    basePrice: 90,
    pricePerKg: 30,
    deliveryTime: '24 Hours',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    maxWeight: 50,
    features: ['Door-to-door', 'Real-time tracking', 'SMS alerts', 'Insurance available']
  },
  {
    id: 'priority',
    provider: 'DTDC',
    name: 'Priority Express',
    description: '1-2 days delivery Pan India',
    icon: Truck,
    basePrice: 70,
    pricePerKg: 25,
    deliveryTime: '1-2 Days',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    maxWeight: 100,
    features: ['Pan India coverage', 'Tracking', 'POD available', 'Insurance']
  },
  {
    id: 'standard',
    provider: 'Blue Dart',
    name: 'Standard Delivery',
    description: '2-4 days delivery',
    icon: Package,
    basePrice: 60,
    pricePerKg: 20,
    deliveryTime: '2-4 Days',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    maxWeight: 75,
    features: ['Economical', 'Reliable', 'Tracking', 'Wide coverage']
  },
  {
    id: 'surface',
    provider: 'DTDC',
    name: 'Economy Surface',
    description: '4-7 days delivery',
    icon: Box,
    basePrice: 40,
    pricePerKg: 15,
    deliveryTime: '4-7 Days',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    maxWeight: 200,
    features: ['Cost-effective', 'Heavy shipments', 'Bulk friendly', 'Tracking']
  },
  {
    id: 'document',
    provider: 'Blue Dart',
    name: 'Document Express',
    description: 'Same/Next day for documents',
    icon: FileText,
    basePrice: 50,
    pricePerKg: 10,
    deliveryTime: 'Same/Next Day',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    maxWeight: 5,
    features: ['Document safe', 'Fast delivery', 'Tracking', 'POD']
  },
  {
    id: 'cod',
    provider: 'DTDC',
    name: 'COD Service',
    description: 'Cash on Delivery service',
    icon: Banknote,
    basePrice: 75,
    pricePerKg: 22,
    deliveryTime: '2-3 Days',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    maxWeight: 50,
    features: ['COD enabled', 'Reverse pickup', 'Payment collection', 'Insurance']
  }
];

// Package types based on courier industry standards
const packageTypes = [
  { 
    id: 'envelope', 
    name: 'Envelope/Document', 
    maxWeight: 0.5, 
    icon: FileText,
    dimensions: { length: 30, width: 25, height: 2 },
    description: 'Letters, documents, certificates'
  },
  { 
    id: 'small', 
    name: 'Small Parcel', 
    maxWeight: 5, 
    icon: PackageOpen,
    dimensions: { length: 30, width: 25, height: 15 },
    description: 'Books, accessories, small items'
  },
  { 
    id: 'medium', 
    name: 'Medium Parcel', 
    maxWeight: 20, 
    icon: Package,
    dimensions: { length: 45, width: 35, height: 30 },
    description: 'Clothes, electronics, household items'
  },
  { 
    id: 'large', 
    name: 'Large Parcel', 
    maxWeight: 50, 
    icon: PackageCheck,
    dimensions: { length: 60, width: 45, height: 45 },
    description: 'Appliances, bulk items, large packages'
  },
  { 
    id: 'cargo', 
    name: 'Cargo/Heavy', 
    maxWeight: 200, 
    icon: Box,
    dimensions: { length: 100, width: 75, height: 75 },
    description: 'Furniture, machinery, heavy shipments'
  }
];

export function CourierServicesClean() {
  const [activeTab, setActiveTab] = useState('new-booking');
  const [selectedService, setSelectedService] = useState('');
  const [selectedPackageType, setSelectedPackageType] = useState('');
  const [showPincodeCheck, setShowPincodeCheck] = useState(false);
  const [pincodeServiceable, setPincodeServiceable] = useState<boolean | null>(null);
  
  // Form state - Enhanced based on DTDC/Blue Dart
  const [formData, setFormData] = useState({
    // Package Details
    weight: '',
    length: '',
    width: '',
    height: '',
    volumetricWeight: '',
    packageContent: '',
    declaredValue: '',
    
    // Pickup Details
    pickupAddress: '',
    pickupLandmark: '',
    pickupCity: '',
    pickupState: '',
    pickupPincode: '',
    pickupDate: '',
    pickupTimeSlot: '',
    
    // Delivery Details
    deliveryAddress: '',
    deliveryLandmark: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryPincode: '',
    
    // Sender Details
    senderName: 'Raghava Boyidi',
    senderPhone: '+91 9876543210',
    senderEmail: 'raghava@acmecorp.com',
    senderGSTIN: '',
    
    // Receiver Details
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    receiverGSTIN: '',
    
    // Additional Options
    insurance: false,
    insuranceValue: '',
    codEnabled: false,
    codAmount: '',
    smsNotification: true,
    emailNotification: true,
    proofOfDelivery: true,
    
    // Special Instructions
    specialInstructions: '',
    fragile: false,
    dangerousGoods: false
  });

  // Mock bookings data - Enhanced
  const [bookings] = useState<CourierBooking[]>([
    {
      id: '1',
      trackingNumber: 'BD-2024-E-001234',
      serviceType: 'Express Domestic',
      serviceProvider: 'Blue Dart',
      packageType: 'Small Parcel',
      weight: 2.5,
      volumetricWeight: 2.8,
      dimensions: { length: 30, width: 25, height: 15 },
      pickupAddress: '123 MG Road, Bangalore',
      deliveryAddress: '456 Anna Salai, Chennai',
      pickupPincode: '560001',
      deliveryPincode: '600001',
      pickupDate: '2024-12-29',
      pickupTime: '10:00 AM',
      senderName: 'Raghava Boyidi',
      senderPhone: '+91 9876543210',
      receiverName: 'John Smith',
      receiverPhone: '+91 9988776655',
      description: 'Electronic items',
      declaredValue: 5000,
      estimatedCost: 165,
      insuranceValue: 5000,
      status: 'in-transit',
      estimatedDelivery: '2024-12-30',
      createdAt: '2024-12-28'
    },
    {
      id: '2',
      trackingNumber: 'DTDC-2024-P-567890',
      serviceType: 'Priority Express',
      serviceProvider: 'DTDC',
      packageType: 'Medium Parcel',
      weight: 8,
      volumetricWeight: 7.5,
      pickupAddress: '789 Park Street, Kolkata',
      deliveryAddress: '321 Marine Drive, Mumbai',
      pickupPincode: '700016',
      deliveryPincode: '400002',
      pickupDate: '2024-12-27',
      pickupTime: '2:00 PM',
      senderName: 'Raghava Boyidi',
      senderPhone: '+91 9876543210',
      receiverName: 'Sarah Wilson',
      receiverPhone: '+91 9123456789',
      description: 'Office documents',
      declaredValue: 2000,
      estimatedCost: 270,
      codAmount: 2000,
      status: 'delivered',
      estimatedDelivery: '2024-12-29',
      createdAt: '2024-12-26'
    },
    {
      id: '3',
      trackingNumber: 'BD-2024-D-789012',
      serviceType: 'Document Express',
      serviceProvider: 'Blue Dart',
      packageType: 'Envelope/Document',
      weight: 0.3,
      pickupAddress: '45 Residency Road, Bangalore',
      deliveryAddress: '89 Nehru Place, New Delhi',
      pickupPincode: '560025',
      deliveryPincode: '110019',
      pickupDate: '2024-12-29',
      pickupTime: '11:00 AM',
      senderName: 'Raghava Boyidi',
      senderPhone: '+91 9876543210',
      receiverName: 'Amit Kumar',
      receiverPhone: '+91 9876512345',
      description: 'Legal documents',
      declaredValue: 500,
      estimatedCost: 53,
      status: 'out-for-delivery',
      estimatedDelivery: '2024-12-29',
      createdAt: '2024-12-28'
    }
  ]);

  // Calculate volumetric weight (L x W x H / 5000) - Industry standard
  const calculateVolumetricWeight = () => {
    const { length, width, height } = formData;
    if (length && width && height) {
      const volWeight = (parseFloat(length) * parseFloat(width) * parseFloat(height)) / 5000;
      setFormData(prev => ({ ...prev, volumetricWeight: volWeight.toFixed(2) }));
      return volWeight;
    }
    return 0;
  };

  // Calculate chargeable weight (higher of actual or volumetric)
  const getChargeableWeight = () => {
    const actualWeight = parseFloat(formData.weight) || 0;
    const volWeight = parseFloat(formData.volumetricWeight) || 0;
    return Math.max(actualWeight, volWeight);
  };

  // Check PIN code serviceability
  const checkPincodeServiceability = (pincode: string) => {
    // Mock check - in real scenario, call API
    if (pincode.length === 6) {
      // Simulate API call
      setTimeout(() => {
        setPincodeServiceable(true);
        toast.success(`Pincode ${pincode} is serviceable`, {
          description: 'Delivery available in 2-4 working days'
        });
      }, 500);
    }
  };

  // Calculate estimate based on DTDC/Blue Dart pricing model
  const calculateEstimate = () => {
    if (!selectedService || !formData.weight) {
      return { subtotal: 0, gst: 0, total: 0, breakdown: [] };
    }

    const service = courierServices.find(s => s.id === selectedService);
    if (!service) return { subtotal: 0, gst: 0, total: 0, breakdown: [] };

    const chargeableWeight = getChargeableWeight();
    const breakdown: { label: string; amount: number }[] = [];

    // Base freight charges
    let subtotal = service.basePrice;
    breakdown.push({ label: 'Base Charge', amount: service.basePrice });

    // Weight charges
    const weightCharge = chargeableWeight * service.pricePerKg;
    subtotal += weightCharge;
    breakdown.push({ label: `Weight Charge (${chargeableWeight.toFixed(2)} kg × ₹${service.pricePerKg})`, amount: weightCharge });

    // COD charges (2% of COD amount, min ₹30)
    if (formData.codEnabled && formData.codAmount) {
      const codCharge = Math.max(parseFloat(formData.codAmount) * 0.02, 30);
      subtotal += codCharge;
      breakdown.push({ label: 'COD Handling (2%)', amount: codCharge });
    }

    // Insurance (0.5% of declared value, min ₹20)
    if (formData.insurance && formData.insuranceValue) {
      const insuranceCharge = Math.max(parseFloat(formData.insuranceValue) * 0.005, 20);
      subtotal += insuranceCharge;
      breakdown.push({ label: 'Insurance (0.5%)', amount: insuranceCharge });
    }

    // Fuel surcharge (typically 15-20% in courier industry)
    const fuelSurcharge = subtotal * 0.18;
    subtotal += fuelSurcharge;
    breakdown.push({ label: 'Fuel Surcharge (18%)', amount: fuelSurcharge });

    // GST (18%)
    const gst = subtotal * 0.18;

    return {
      subtotal: Math.round(subtotal),
      gst: Math.round(gst),
      total: Math.round(subtotal + gst),
      breakdown
    };
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate volumetric weight when dimensions change
    if (['length', 'width', 'height'].includes(field)) {
      setTimeout(calculateVolumetricWeight, 100);
    }
  };

  const handleBookCourier = () => {
    if (!selectedService || !selectedPackageType || !formData.pickupAddress || 
        !formData.deliveryAddress || !formData.receiverName || !formData.receiverPhone ||
        !formData.pickupPincode || !formData.deliveryPincode) {
      toast.error('Please fill all required fields');
      return;
    }

    const estimate = calculateEstimate();
    const service = courierServices.find(s => s.id === selectedService);
    
    toast.success(`Courier booked successfully!`, {
      description: `${service?.provider} - ${service?.name} | Total: ₹${estimate.total}`,
      duration: 5000
    });

    // Reset form
    setSelectedService('');
    setSelectedPackageType('');
    setFormData({
      ...formData,
      weight: '',
      length: '',
      width: '',
      height: '',
      volumetricWeight: '',
      packageContent: '',
      declaredValue: '',
      pickupAddress: '',
      pickupLandmark: '',
      pickupCity: '',
      pickupState: '',
      pickupPincode: '',
      pickupDate: '',
      pickupTimeSlot: '',
      deliveryAddress: '',
      deliveryLandmark: '',
      deliveryCity: '',
      deliveryState: '',
      deliveryPincode: '',
      receiverName: '',
      receiverPhone: '',
      receiverEmail: '',
      receiverGSTIN: '',
      insurance: false,
      insuranceValue: '',
      codEnabled: false,
      codAmount: '',
      specialInstructions: '',
      fragile: false,
      dangerousGoods: false
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'out-for-delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-transit':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'picked-up':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'failed-delivery':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'out-for-delivery':
      case 'in-transit':
        return <Truck className="w-4 h-4" />;
      case 'picked-up':
        return <PackageOpen className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
      case 'failed-delivery':
        return <PackageX className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const estimate = calculateEstimate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-[#000035] rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courier Services</h1>
            <p className="text-gray-600">Powered by Blue Dart & DTDC - India's trusted courier partners</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-gray-200 mb-6">
          <TabsTrigger value="new-booking" className="data-[state=active]:bg-[#000035] data-[state=active]:text-white">
            <Package className="w-4 h-4 mr-2" />
            New Booking
          </TabsTrigger>
          <TabsTrigger value="my-shipments" className="data-[state=active]:bg-[#000035] data-[state=active]:text-white">
            <Truck className="w-4 h-4 mr-2" />
            My Shipments ({bookings.length})
          </TabsTrigger>
          <TabsTrigger value="track" className="data-[state=active]:bg-[#000035] data-[state=active]:text-white">
            <Search className="w-4 h-4 mr-2" />
            Track Package
          </TabsTrigger>
          <TabsTrigger value="pincode-check" className="data-[state=active]:bg-[#000035] data-[state=active]:text-white">
            <MapPin className="w-4 h-4 mr-2" />
            Serviceability
          </TabsTrigger>
        </TabsList>

        {/* New Booking Tab */}
        <TabsContent value="new-booking" className="space-y-6">
          {/* Service Selection */}
          <Card className="p-6 border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Courier Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courierServices.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      selectedService === service.id
                        ? 'border-[#000035] bg-gray-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 ${service.bgColor} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${service.color}`} />
                      </div>
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                        {service.provider}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#000035]">{service.deliveryTime}</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        from ₹{service.basePrice}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {selectedService && (
            <>
              {/* Package Details */}
              <Card className="p-6 border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Box className="w-5 h-5 text-blue-600" />
                  Package Details
                </h2>
                
                {/* Package Type Selection */}
                <div className="mb-6">
                  <Label className="text-gray-700 mb-2 block">Package Type *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {packageTypes.map((pkg) => {
                      const Icon = pkg.icon;
                      return (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackageType(pkg.id)}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            selectedPackageType === pkg.id
                              ? 'border-[#000035] bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-6 h-6 text-gray-700 mx-auto mb-1" />
                          <p className="text-xs font-medium text-gray-900">{pkg.name}</p>
                          <p className="text-xs text-gray-500">Up to {pkg.maxWeight}kg</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="weight" className="text-gray-700 flex items-center gap-2">
                        <Weight className="w-4 h-4" />
                        Actual Weight (kg) *
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 2.5"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700 flex items-center gap-2 mb-2">
                        <Ruler className="w-4 h-4" />
                        Dimensions (cm) - for volumetric weight
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          type="number"
                          placeholder="Length"
                          value={formData.length}
                          onChange={(e) => handleInputChange('length', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Width"
                          value={formData.width}
                          onChange={(e) => handleInputChange('width', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Height"
                          value={formData.height}
                          onChange={(e) => handleInputChange('height', e.target.value)}
                        />
                      </div>
                      {formData.volumetricWeight && (
                        <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
                          <Calculator className="w-4 h-4" />
                          Volumetric Weight: {formData.volumetricWeight} kg
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="packageContent" className="text-gray-700">Package Contents *</Label>
                      <Input
                        id="packageContent"
                        placeholder="e.g., Electronics, Documents, Clothing"
                        value={formData.packageContent}
                        onChange={(e) => handleInputChange('packageContent', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="declaredValue" className="text-gray-700 flex items-center gap-2">
                        <IndianRupee className="w-4 h-4" />
                        Declared Value (₹) *
                      </Label>
                      <Input
                        id="declaredValue"
                        type="number"
                        placeholder="e.g., 5000"
                        value={formData.declaredValue}
                        onChange={(e) => handleInputChange('declaredValue', e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Invoice value of shipment contents</p>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.insurance}
                          onChange={(e) => handleInputChange('insurance', e.target.checked)}
                          className="w-4 h-4 text-[#000035] border-gray-300 rounded focus:ring-[#000035]"
                        />
                        <Shield className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">Add Insurance Coverage</span>
                          <p className="text-xs text-gray-500">0.5% of declared value (min ₹20)</p>
                        </div>
                      </label>

                      {formData.insurance && (
                        <Input
                          type="number"
                          placeholder="Insurance value (₹)"
                          value={formData.insuranceValue}
                          onChange={(e) => handleInputChange('insuranceValue', e.target.value)}
                          className="ml-6"
                        />
                      )}

                      <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.fragile}
                          onChange={(e) => handleInputChange('fragile', e.target.checked)}
                          className="w-4 h-4 text-[#000035] border-gray-300 rounded focus:ring-[#000035]"
                        />
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">Fragile - Handle with Care</span>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Pickup & Delivery Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pickup Details */}
                <Card className="p-6 border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Pickup Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pickupAddress" className="text-gray-700">Address *</Label>
                      <Input
                        id="pickupAddress"
                        placeholder="Flat/Building, Street"
                        value={formData.pickupAddress}
                        onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickupLandmark" className="text-gray-700">Landmark</Label>
                      <Input
                        id="pickupLandmark"
                        placeholder="Nearby landmark"
                        value={formData.pickupLandmark}
                        onChange={(e) => handleInputChange('pickupLandmark', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="pickupCity" className="text-gray-700">City *</Label>
                        <Input
                          id="pickupCity"
                          placeholder="City"
                          value={formData.pickupCity}
                          onChange={(e) => handleInputChange('pickupCity', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pickupState" className="text-gray-700">State *</Label>
                        <Input
                          id="pickupState"
                          placeholder="State"
                          value={formData.pickupState}
                          onChange={(e) => handleInputChange('pickupState', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="pickupPincode" className="text-gray-700">PIN Code *</Label>
                      <Input
                        id="pickupPincode"
                        placeholder="6-digit PIN code"
                        maxLength={6}
                        value={formData.pickupPincode}
                        onChange={(e) => {
                          handleInputChange('pickupPincode', e.target.value);
                          if (e.target.value.length === 6) {
                            checkPincodeServiceability(e.target.value);
                          }
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="pickupDate" className="text-gray-700">Pickup Date *</Label>
                        <Input
                          id="pickupDate"
                          type="date"
                          value={formData.pickupDate}
                          onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pickupTimeSlot" className="text-gray-700">Time Slot *</Label>
                        <select
                          id="pickupTimeSlot"
                          value={formData.pickupTimeSlot}
                          onChange={(e) => handleInputChange('pickupTimeSlot', e.target.value)}
                          className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000035]"
                        >
                          <option value="">Select slot</option>
                          <option value="9-12">9 AM - 12 PM</option>
                          <option value="12-15">12 PM - 3 PM</option>
                          <option value="15-18">3 PM - 6 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Delivery Details */}
                <Card className="p-6 border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-green-600" />
                    Delivery Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="deliveryAddress" className="text-gray-700">Address *</Label>
                      <Input
                        id="deliveryAddress"
                        placeholder="Flat/Building, Street"
                        value={formData.deliveryAddress}
                        onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryLandmark" className="text-gray-700">Landmark</Label>
                      <Input
                        id="deliveryLandmark"
                        placeholder="Nearby landmark"
                        value={formData.deliveryLandmark}
                        onChange={(e) => handleInputChange('deliveryLandmark', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="deliveryCity" className="text-gray-700">City *</Label>
                        <Input
                          id="deliveryCity"
                          placeholder="City"
                          value={formData.deliveryCity}
                          onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryState" className="text-gray-700">State *</Label>
                        <Input
                          id="deliveryState"
                          placeholder="State"
                          value={formData.deliveryState}
                          onChange={(e) => handleInputChange('deliveryState', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="deliveryPincode" className="text-gray-700">PIN Code *</Label>
                      <Input
                        id="deliveryPincode"
                        placeholder="6-digit PIN code"
                        maxLength={6}
                        value={formData.deliveryPincode}
                        onChange={(e) => {
                          handleInputChange('deliveryPincode', e.target.value);
                          if (e.target.value.length === 6) {
                            checkPincodeServiceability(e.target.value);
                          }
                        }}
                        className="mt-1"
                      />
                    </div>

                    {/* COD Option */}
                    <div className="border-t pt-4 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.codEnabled}
                          onChange={(e) => handleInputChange('codEnabled', e.target.checked)}
                          className="w-4 h-4 text-[#000035] border-gray-300 rounded focus:ring-[#000035]"
                        />
                        <Banknote className="w-4 h-4 text-yellow-600" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">Cash on Delivery (COD)</span>
                          <p className="text-xs text-gray-500">Collect payment from receiver</p>
                        </div>
                      </label>
                      {formData.codEnabled && (
                        <Input
                          type="number"
                          placeholder="COD Amount (₹)"
                          value={formData.codAmount}
                          onChange={(e) => handleInputChange('codAmount', e.target.value)}
                          className="mt-3"
                        />
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sender Details */}
                <Card className="p-6 border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Sender Details</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="senderName" className="text-gray-700">Name *</Label>
                      <Input
                        id="senderName"
                        value={formData.senderName}
                        onChange={(e) => handleInputChange('senderName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderPhone" className="text-gray-700">Phone *</Label>
                      <Input
                        id="senderPhone"
                        value={formData.senderPhone}
                        onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderEmail" className="text-gray-700">Email</Label>
                      <Input
                        id="senderEmail"
                        type="email"
                        value={formData.senderEmail}
                        onChange={(e) => handleInputChange('senderEmail', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderGSTIN" className="text-gray-700">GSTIN (Optional)</Label>
                      <Input
                        id="senderGSTIN"
                        placeholder="15-digit GSTIN"
                        value={formData.senderGSTIN}
                        onChange={(e) => handleInputChange('senderGSTIN', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Card>

                {/* Receiver Details */}
                <Card className="p-6 border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Receiver Details</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="receiverName" className="text-gray-700">Name *</Label>
                      <Input
                        id="receiverName"
                        placeholder="Receiver's name"
                        value={formData.receiverName}
                        onChange={(e) => handleInputChange('receiverName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="receiverPhone" className="text-gray-700">Phone *</Label>
                      <Input
                        id="receiverPhone"
                        placeholder="+91 XXXXXXXXXX"
                        value={formData.receiverPhone}
                        onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="receiverEmail" className="text-gray-700">Email</Label>
                      <Input
                        id="receiverEmail"
                        type="email"
                        placeholder="receiver@example.com"
                        value={formData.receiverEmail}
                        onChange={(e) => handleInputChange('receiverEmail', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="receiverGSTIN" className="text-gray-700">GSTIN (Optional)</Label>
                      <Input
                        id="receiverGSTIN"
                        placeholder="15-digit GSTIN"
                        value={formData.receiverGSTIN}
                        onChange={(e) => handleInputChange('receiverGSTIN', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Additional Options */}
              <Card className="p-6 border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.smsNotification}
                      onChange={(e) => handleInputChange('smsNotification', e.target.checked)}
                      className="w-4 h-4 text-[#000035] border-gray-300 rounded focus:ring-[#000035]"
                    />
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">SMS Notifications (Free)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.emailNotification}
                      onChange={(e) => handleInputChange('emailNotification', e.target.checked)}
                      className="w-4 h-4 text-[#000035] border-gray-300 rounded focus:ring-[#000035]"
                    />
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Email Notifications (Free)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.proofOfDelivery}
                      onChange={(e) => handleInputChange('proofOfDelivery', e.target.checked)}
                      className="w-4 h-4 text-[#000035] border-gray-300 rounded focus:ring-[#000035]"
                    />
                    <ImageIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Proof of Delivery (POD)</span>
                  </label>
                </div>

                <div className="mt-4">
                  <Label htmlFor="specialInstructions" className="text-gray-700">Special Instructions</Label>
                  <textarea
                    id="specialInstructions"
                    rows={3}
                    placeholder="Any special handling instructions..."
                    value={formData.specialInstructions}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000035]"
                  />
                </div>
              </Card>

              {/* Cost Summary & Book Button */}
              <Card className="p-6 border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Summary</h3>
                
                {/* Breakdown */}
                <div className="space-y-2 mb-4 pb-4 border-b">
                  {estimate.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-gray-900">₹{item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-gray-900 font-medium">₹{estimate.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">GST (18%)</span>
                    <span className="text-gray-900 font-medium">₹{estimate.gst}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <div className="flex items-center gap-1 text-2xl font-bold text-[#000035]">
                      <IndianRupee className="w-6 h-6" />
                      {estimate.total}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleBookCourier}
                  className="w-full bg-[#000035] hover:bg-[#000055] text-white h-12 text-lg"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Confirm Booking
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  By proceeding, you agree to the terms and conditions of the courier service
                </p>
              </Card>
            </>
          )}
        </TabsContent>

        {/* My Shipments Tab */}
        <TabsContent value="my-shipments" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Shipments</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {bookings.map((booking) => (
            <Card key={booking.id} className="p-6 border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status.replace('-', ' ')}</span>
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                      {booking.serviceProvider}
                    </Badge>
                  </div>

                  <p className="font-mono text-sm text-[#000035] font-semibold mb-3">{booking.trackingNumber}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">From (PIN: {booking.pickupPincode})</p>
                      <p className="font-medium text-gray-900">{booking.pickupAddress}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">To (PIN: {booking.deliveryPincode})</p>
                      <p className="font-medium text-gray-900">{booking.deliveryAddress}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {booking.packageType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Weight className="w-4 h-4" />
                      {booking.weight}kg
                      {booking.volumetricWeight && ` (Vol: ${booking.volumetricWeight}kg)`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      {booking.serviceType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Pickup: {booking.pickupDate}
                    </span>
                    {booking.estimatedDelivery && (
                      <span className="flex items-center gap-1 text-green-600">
                        <Clock className="w-4 h-4" />
                        Est. Delivery: {booking.estimatedDelivery}
                      </span>
                    )}
                  </div>

                  {booking.codAmount && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg inline-flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">COD: ₹{booking.codAmount}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-2xl font-bold text-gray-900 mb-2">
                    <IndianRupee className="w-5 h-5" />
                    {booking.estimatedCost}
                  </div>
                  <Button variant="outline" size="sm" className="border-[#000035] text-[#000035] hover:bg-[#000035] hover:text-white">
                    <Search className="w-4 h-4 mr-1" />
                    Track Package
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Track Package Tab */}
        <TabsContent value="track" className="space-y-6">
          <Card className="p-6 border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Track Your Package</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Enter tracking number (e.g., BD-2024-E-001234 or DTDC-2024-P-567890)"
                className="flex-1"
              />
              <Button className="bg-[#000035] hover:bg-[#000055]">
                <Search className="w-4 h-4 mr-2" />
                Track
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Enter your Blue Dart or DTDC tracking number to get real-time updates
            </p>
          </Card>

          {/* Sample Tracking Timeline */}
          <Card className="p-6 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Shipment Timeline</h3>
                <p className="text-sm text-gray-600">Tracking: BD-2024-E-001234</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                In Transit
              </Badge>
            </div>

            <div className="space-y-6">
              {[
                { 
                  status: 'Out for Delivery', 
                  location: 'Chennai Delivery Hub', 
                  time: '2024-12-29, 08:30 AM', 
                  active: true,
                  description: 'Package is out for delivery and will reach you today'
                },
                { 
                  status: 'In Transit', 
                  location: 'Chennai Sorting Hub', 
                  time: '2024-12-29, 06:00 AM', 
                  active: false,
                  description: 'Package arrived at Chennai facility'
                },
                { 
                  status: 'In Transit', 
                  location: 'Bangalore Hub', 
                  time: '2024-12-28, 10:00 PM', 
                  active: false,
                  description: 'Departed from origin facility'
                },
                { 
                  status: 'Picked Up', 
                  location: 'Bangalore MG Road', 
                  time: '2024-12-28, 02:30 PM', 
                  active: false,
                  description: 'Package picked up from sender'
                },
                { 
                  status: 'Scheduled', 
                  location: 'Bangalore', 
                  time: '2024-12-28, 10:00 AM', 
                  active: false,
                  description: 'Pickup scheduled'
                }
              ].map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      event.active ? 'bg-[#000035]' : 'bg-gray-300'
                    }`}>
                      <CheckCircle2 className={`w-5 h-5 ${event.active ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    {index < 4 && <div className="w-0.5 h-16 bg-gray-300 mt-2" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className={`font-semibold ${event.active ? 'text-[#000035]' : 'text-gray-900'}`}>
                      {event.status}
                    </h4>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <p className="text-sm text-gray-500">{event.time}</p>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Pincode Serviceability Check Tab */}
        <TabsContent value="pincode-check" className="space-y-6">
          <Card className="p-6 border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Check PIN Code Serviceability</h2>
            <p className="text-gray-600 mb-4">Verify if delivery is available to your location</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter 6-digit PIN code"
                maxLength={6}
                className="flex-1"
                onChange={(e) => {
                  if (e.target.value.length === 6) {
                    checkPincodeServiceability(e.target.value);
                  }
                }}
              />
              <Button className="bg-[#000035] hover:bg-[#000055]">
                <MapPin className="w-4 h-4 mr-2" />
                Check
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Blue Dart Coverage</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>28,000+ PIN codes across India</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>220+ countries worldwide</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Express delivery to all major cities</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">DTDC Coverage</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>15,000+ PIN codes in India</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>240+ international locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Economical rates for all pin codes</span>
                </li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
