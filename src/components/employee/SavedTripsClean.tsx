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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  Bookmark, 
  Plane, 
  Bus, 
  Car, 
  Hotel,
  MapPin,
  Calendar,
  Star,
  Trash2,
  Edit,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  Search,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export interface SavedTrip {
  id: string;
  name: string;
  type: 'Flight' | 'Cab' | 'Hotel' | 'Bus';
  from: string;
  to: string;
  frequency: string;
  lastBooked: string;
  timesBooked: number;
  avgPrice: number;
  favorite: boolean;
  notes?: string;
}

const initialSavedTrips: SavedTrip[] = [
  {
    id: 'saved-1',
    name: 'Mumbai to Delhi - Weekly Flight',
    type: 'Flight',
    from: 'Mumbai',
    to: 'Delhi',
    frequency: 'Weekly',
    lastBooked: '2024-12-15',
    timesBooked: 12,
    avgPrice: 4500,
    favorite: true,
    notes: 'Preferred early morning flights',
  },
  {
    id: 'saved-2',
    name: 'Office to Airport Cab',
    type: 'Cab',
    from: 'Office, Andheri',
    to: 'Mumbai Airport',
    frequency: 'As Needed',
    lastBooked: '2024-12-10',
    timesBooked: 8,
    avgPrice: 450,
    favorite: true,
  },
  {
    id: 'saved-3',
    name: 'Bangalore Business Hotel',
    type: 'Hotel',
    from: 'Bangalore',
    to: 'The Oberoi',
    frequency: 'Monthly',
    lastBooked: '2024-11-20',
    timesBooked: 5,
    avgPrice: 6500,
    favorite: false,
    notes: 'Deluxe room preferred',
  },
  {
    id: 'saved-4',
    name: 'Pune to Mumbai Bus',
    type: 'Bus',
    from: 'Pune',
    to: 'Mumbai',
    frequency: 'Occasional',
    lastBooked: '2024-10-05',
    timesBooked: 3,
    avgPrice: 800,
    favorite: false,
  },
];

export function SavedTripsClean() {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(initialSavedTrips);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<SavedTrip | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Flight' as const,
    from: '',
    to: '',
    frequency: 'Weekly',
    avgPrice: '',
    notes: '',
    favorite: false,
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Flight',
      from: '',
      to: '',
      frequency: 'Weekly',
      avgPrice: '',
      notes: '',
      favorite: false,
    });
  };

  // Add new trip
  const handleAddTrip = () => {
    if (!formData.name || !formData.from || !formData.to) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newTrip: SavedTrip = {
      id: `saved-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      from: formData.from,
      to: formData.to,
      frequency: formData.frequency,
      lastBooked: 'Never',
      timesBooked: 0,
      avgPrice: formData.avgPrice ? parseFloat(formData.avgPrice) : 0,
      favorite: formData.favorite,
      notes: formData.notes,
    };

    setSavedTrips([newTrip, ...savedTrips]);
    toast.success('Trip saved successfully!');
    setShowAddDialog(false);
    resetForm();
  };

  // Edit trip
  const handleEditClick = (trip: SavedTrip) => {
    setSelectedTrip(trip);
    setFormData({
      name: trip.name,
      type: trip.type,
      from: trip.from,
      to: trip.to,
      frequency: trip.frequency,
      avgPrice: trip.avgPrice.toString(),
      notes: trip.notes || '',
      favorite: trip.favorite,
    });
    setShowEditDialog(true);
  };

  const handleUpdateTrip = () => {
    if (!selectedTrip) return;

    if (!formData.name || !formData.from || !formData.to) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSavedTrips(savedTrips.map(trip =>
      trip.id === selectedTrip.id
        ? {
            ...trip,
            name: formData.name,
            type: formData.type,
            from: formData.from,
            to: formData.to,
            frequency: formData.frequency,
            avgPrice: formData.avgPrice ? parseFloat(formData.avgPrice) : trip.avgPrice,
            notes: formData.notes,
            favorite: formData.favorite,
          }
        : trip
    ));

    toast.success('Trip updated successfully!');
    setShowEditDialog(false);
    setSelectedTrip(null);
    resetForm();
  };

  // Delete trip
  const handleDeleteClick = (trip: SavedTrip) => {
    setSelectedTrip(trip);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedTrip) return;

    setSavedTrips(savedTrips.filter(trip => trip.id !== selectedTrip.id));
    toast.success('Trip removed from saved trips');
    setShowDeleteDialog(false);
    setSelectedTrip(null);
  };

  // Toggle favorite
  const handleToggleFavorite = (tripId: string) => {
    setSavedTrips(savedTrips.map(trip =>
      trip.id === tripId
        ? { ...trip, favorite: !trip.favorite }
        : trip
    ));
    const trip = savedTrips.find(t => t.id === tripId);
    toast.success(trip?.favorite ? 'Removed from favorites' : 'Added to favorites');
  };

  // Book trip
  const handleBookTrip = (trip: SavedTrip) => {
    // Update times booked and last booked
    setSavedTrips(savedTrips.map(t =>
      t.id === trip.id
        ? {
            ...t,
            timesBooked: t.timesBooked + 1,
            lastBooked: new Date().toISOString().split('T')[0],
          }
        : t
    ));

    toast.success('Redirecting to booking page...', {
      description: `${trip.type} from ${trip.from} to ${trip.to}`,
    });
  };

  // Get service icon
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'Flight': return Plane;
      case 'Bus': return Bus;
      case 'Cab': return Car;
      case 'Hotel': return Hotel;
      default: return MapPin;
    }
  };

  // Get service color
  const getServiceColor = (type: string) => {
    switch (type) {
      case 'Flight': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'Bus': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'Cab': return { bg: 'bg-yellow-100', text: 'text-yellow-600' };
      case 'Hotel': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Filter trips
  const filteredTrips = savedTrips.filter(trip => {
    if (filterFavorites && !trip.favorite) return false;
    
    if (searchQuery && !trip.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !trip.from.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !trip.to.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const favoriteCount = savedTrips.filter(t => t.favorite).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Trips</h1>
              <p className="text-gray-600 mt-1">Quick access to your frequent journeys</p>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Save New Trip
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Saved</p>
                  <p className="text-3xl font-bold text-gray-900">{savedTrips.length}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Bookmark className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Favorites</p>
                  <p className="text-3xl font-bold text-yellow-600">{favoriteCount}</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-green-600">
                    {savedTrips.reduce((sum, t) => sum + t.timesBooked, 0)}
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search saved trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            <Button
              variant={filterFavorites ? 'default' : 'outline'}
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={filterFavorites ? 'bg-[#000035] hover:bg-[#000055]' : ''}
            >
              <Star className={`w-4 h-4 mr-2 ${filterFavorites ? 'fill-current' : ''}`} />
              Favorites Only
            </Button>
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTrips.length === 0 ? (
          <Card className="p-12 text-center">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || filterFavorites ? 'No trips found' : 'No saved trips yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterFavorites
                ? 'Try adjusting your search or filters'
                : 'Save your frequent trips for quick booking'}
            </p>
            {!searchQuery && !filterFavorites && (
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Save Your First Trip
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredTrips.map((trip) => {
              const ServiceIcon = getServiceIcon(trip.type);
              const serviceColor = getServiceColor(trip.type);

              return (
                <Card
                  key={trip.id}
                  className="p-6 border-gray-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 ${serviceColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <ServiceIcon className={`w-7 h-7 ${serviceColor.text}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{trip.name}</h3>
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm font-medium">{trip.from}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm font-medium">{trip.to}</span>
                          </div>
                        </div>

                        {/* Favorite Star */}
                        <button
                          onClick={() => handleToggleFavorite(trip.id)}
                          className="flex-shrink-0"
                        >
                          <Star
                            className={`w-6 h-6 transition-all ${
                              trip.favorite
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-300 hover:fill-yellow-100 hover:text-yellow-300'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-600">Frequency</p>
                          <p className="text-sm font-semibold text-gray-900">{trip.frequency}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-600">Booked</p>
                          <p className="text-sm font-semibold text-gray-900">{trip.timesBooked}x</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-600">Avg Price</p>
                          <p className="text-sm font-semibold text-gray-900">₹{trip.avgPrice.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Last Booked */}
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-4">
                        <Clock className="w-3 h-3" />
                        <span>Last booked: {trip.lastBooked}</span>
                      </div>

                      {/* Notes */}
                      {trip.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-4 line-clamp-2">
                          {trip.notes}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleBookTrip(trip)}
                          className="flex-1 bg-[#000035] hover:bg-[#000055]"
                          size="sm"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Book Now
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(trip)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(trip)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
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

      {/* Add Trip Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Save New Trip</DialogTitle>
            <DialogDescription>
              Save your frequent trip details for quick booking
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="trip-name">Trip Name *</Label>
              <Input
                id="trip-name"
                placeholder="e.g., Mumbai to Delhi - Weekly Flight"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="trip-type">Service Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Flight">Flight</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Cab">Cab</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from">From *</Label>
                <Input
                  id="from"
                  placeholder="Origin"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="to">To *</Label>
                <Input
                  id="to"
                  placeholder="Destination"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Occasional">Occasional</SelectItem>
                    <SelectItem value="As Needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="avg-price">Avg Price (₹)</Label>
                <Input
                  id="avg-price"
                  type="number"
                  placeholder="0"
                  value={formData.avgPrice}
                  onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Preferences, timing, etc."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="favorite"
                checked={formData.favorite}
                onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
                className="w-5 h-5"
              />
              <Label htmlFor="favorite" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Star className={`w-5 h-5 ${formData.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                  <span>Add to favorites</span>
                </div>
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddTrip}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Save Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Trip Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Saved Trip</DialogTitle>
            <DialogDescription>
              Update your trip details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-trip-name">Trip Name *</Label>
              <Input
                id="edit-trip-name"
                placeholder="e.g., Mumbai to Delhi - Weekly Flight"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="edit-trip-type">Service Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Flight">Flight</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Cab">Cab</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-from">From *</Label>
                <Input
                  id="edit-from"
                  placeholder="Origin"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="edit-to">To *</Label>
                <Input
                  id="edit-to"
                  placeholder="Destination"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Occasional">Occasional</SelectItem>
                    <SelectItem value="As Needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-avg-price">Avg Price (₹)</Label>
                <Input
                  id="edit-avg-price"
                  type="number"
                  placeholder="0"
                  value={formData.avgPrice}
                  onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Input
                id="edit-notes"
                placeholder="Preferences, timing, etc."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="edit-favorite"
                checked={formData.favorite}
                onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
                className="w-5 h-5"
              />
              <Label htmlFor="edit-favorite" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Star className={`w-5 h-5 ${formData.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                  <span>Add to favorites</span>
                </div>
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTrip}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Update Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Saved Trip</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this trip from your saved trips?
            </DialogDescription>
          </DialogHeader>

          {selectedTrip && (
            <Card className="p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${getServiceColor(selectedTrip.type).bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {(() => {
                    const ServiceIcon = getServiceIcon(selectedTrip.type);
                    return <ServiceIcon className={`w-5 h-5 ${getServiceColor(selectedTrip.type).text}`} />;
                  })()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedTrip.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedTrip.from} → {selectedTrip.to}
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
              Remove Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
