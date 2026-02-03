import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
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
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Plane,
  Bus,
  Car,
  Hotel,
  Truck,
  MessageSquare,
  Send,
  Award,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RatingCategory {
  id: string;
  name: string;
  rating: number;
}

interface Feedback {
  bookingId: string;
  service: string;
  from: string;
  to: string;
  date: string;
  vendor: string;
  overallRating: number;
  categories: RatingCategory[];
  comment: string;
  wouldRecommend: boolean | null;
  submitted: boolean;
}

const pendingFeedback: Feedback[] = [
  {
    bookingId: 'ORD-004',
    service: 'Cab',
    from: 'Office',
    to: 'Airport',
    date: '2024-12-15',
    vendor: 'Uber',
    overallRating: 0,
    categories: [
      { id: 'punctuality', name: 'Punctuality', rating: 0 },
      { id: 'cleanliness', name: 'Cleanliness', rating: 0 },
      { id: 'driver', name: 'Driver Behavior', rating: 0 },
      { id: 'comfort', name: 'Comfort', rating: 0 },
    ],
    comment: '',
    wouldRecommend: null,
    submitted: false,
  },
  {
    bookingId: 'ORD-005',
    service: 'Bus',
    from: 'Bangalore',
    to: 'Mumbai',
    date: '2024-12-10',
    vendor: 'RedBus',
    overallRating: 0,
    categories: [
      { id: 'punctuality', name: 'Punctuality', rating: 0 },
      { id: 'cleanliness', name: 'Cleanliness', rating: 0 },
      { id: 'staff', name: 'Staff Behavior', rating: 0 },
      { id: 'comfort', name: 'Comfort', rating: 0 },
    ],
    comment: '',
    wouldRecommend: null,
    submitted: false,
  },
];

const submittedFeedback: Feedback[] = [
  {
    bookingId: 'ORD-001',
    service: 'Flight',
    from: 'Mumbai',
    to: 'Delhi',
    date: '2024-12-01',
    vendor: 'IndiGo',
    overallRating: 5,
    categories: [
      { id: 'punctuality', name: 'Punctuality', rating: 5 },
      { id: 'service', name: 'In-flight Service', rating: 4 },
      { id: 'cleanliness', name: 'Cleanliness', rating: 5 },
      { id: 'comfort', name: 'Comfort', rating: 4 },
    ],
    comment: 'Excellent flight experience. Everything was on time and staff was very professional.',
    wouldRecommend: true,
    submitted: true,
  },
  {
    bookingId: 'ORD-002',
    service: 'Hotel',
    from: 'Delhi',
    to: 'The Grand Plaza',
    date: '2024-11-25',
    vendor: 'Agoda',
    overallRating: 4,
    categories: [
      { id: 'checkin', name: 'Check-in Experience', rating: 5 },
      { id: 'cleanliness', name: 'Room Cleanliness', rating: 4 },
      { id: 'amenities', name: 'Amenities', rating: 4 },
      { id: 'staff', name: 'Staff Service', rating: 4 },
    ],
    comment: 'Great hotel with excellent service. Only minor issue was room service could be faster.',
    wouldRecommend: true,
    submitted: true,
  },
];

export function RatingFeedbackClean() {
  const [pending, setPending] = useState<Feedback[]>(pendingFeedback);
  const [submitted, setSubmitted] = useState<Feedback[]>(submittedFeedback);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  // Handle rating change
  const handleRatingChange = (type: 'overall' | 'category', value: number, categoryId?: string) => {
    if (!selectedFeedback) return;

    if (type === 'overall') {
      setSelectedFeedback({ ...selectedFeedback, overallRating: value });
    } else if (categoryId) {
      setSelectedFeedback({
        ...selectedFeedback,
        categories: selectedFeedback.categories.map(cat =>
          cat.id === categoryId ? { ...cat, rating: value } : cat
        ),
      });
    }
  };

  // Submit feedback
  const handleSubmitFeedback = () => {
    if (!selectedFeedback) return;

    // Validation
    if (selectedFeedback.overallRating === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    const unratedCategories = selectedFeedback.categories.filter(cat => cat.rating === 0);
    if (unratedCategories.length > 0) {
      toast.error('Please rate all categories');
      return;
    }

    if (selectedFeedback.wouldRecommend === null) {
      toast.error('Please select whether you would recommend this service');
      return;
    }

    // Move from pending to submitted
    const updatedFeedback = { ...selectedFeedback, submitted: true };
    setPending(pending.filter(f => f.bookingId !== selectedFeedback.bookingId));
    setSubmitted([updatedFeedback, ...submitted]);

    toast.success('Thank you for your feedback!', {
      description: 'Your rating has been submitted successfully.',
    });

    setShowRatingDialog(false);
    setSelectedFeedback(null);
  };

  // Get service icon
  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Flight': return Plane;
      case 'Bus': return Bus;
      case 'Cab': return Car;
      case 'Hotel': return Hotel;
      case 'Truck': return Truck;
      default: return Car;
    }
  };

  // Get service color
  const getServiceColor = (service: string) => {
    switch (service) {
      case 'Flight': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'Bus': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'Cab': return { bg: 'bg-yellow-100', text: 'text-yellow-600' };
      case 'Hotel': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'Truck': return { bg: 'bg-orange-100', text: 'text-orange-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Star rating component
  const StarRating = ({ rating, onChange, readonly = false }: { rating: number; onChange?: (rating: number) => void; readonly?: boolean }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange && onChange(star)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            <Star
              className={`w-6 h-6 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ratings & Feedback</h1>
            <p className="text-gray-600 mt-1">Share your experience and help us improve</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Feedback</p>
                  <p className="text-3xl font-bold text-yellow-600">{pending.length}</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Submitted Reviews</p>
                  <p className="text-3xl font-bold text-green-600">{submitted.length}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-gray-900">
                      {submitted.length > 0
                        ? (submitted.reduce((sum, f) => sum + f.overallRating, 0) / submitted.length).toFixed(1)
                        : '0.0'}
                    </p>
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Award className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pending Feedback */}
        {pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Feedback</h2>
            <div className="grid gap-4">
              {pending.map((feedback) => {
                const ServiceIcon = getServiceIcon(feedback.service);
                const serviceColor = getServiceColor(feedback.service);

                return (
                  <Card key={feedback.bookingId} className="p-6 border-2 border-yellow-200 bg-yellow-50/30 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 ${serviceColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <ServiceIcon className={`w-7 h-7 ${serviceColor.text}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{feedback.service}</h3>
                              <Badge className="bg-yellow-600 text-white border-0">
                                Feedback Pending
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">
                              {feedback.from} → {feedback.to}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Date: {feedback.date}</span>
                              <span>•</span>
                              <span>Booking ID: {feedback.bookingId}</span>
                              <span>•</span>
                              <span>Vendor: {feedback.vendor}</span>
                            </div>
                          </div>

                          <Button
                            onClick={() => {
                              setSelectedFeedback(feedback);
                              setShowRatingDialog(true);
                            }}
                            className="bg-[#000035] hover:bg-[#000055]"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Rate Now
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

        {/* Submitted Feedback */}
        {submitted.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Reviews</h2>
            <div className="grid gap-4">
              {submitted.map((feedback) => {
                const ServiceIcon = getServiceIcon(feedback.service);
                const serviceColor = getServiceColor(feedback.service);

                return (
                  <Card
                    key={feedback.bookingId}
                    className="p-6 border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedFeedback(feedback);
                      setShowViewDialog(true);
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 ${serviceColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <ServiceIcon className={`w-7 h-7 ${serviceColor.text}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{feedback.service}</h3>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-gray-900">{feedback.overallRating}.0</span>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-2">
                              {feedback.from} → {feedback.to}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Date: {feedback.date}</span>
                              <span>•</span>
                              <span>Booking ID: {feedback.bookingId}</span>
                              <span>•</span>
                              <span>Vendor: {feedback.vendor}</span>
                            </div>
                          </div>

                          <Badge className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Submitted
                          </Badge>
                        </div>

                        {feedback.comment && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg line-clamp-2">
                            "{feedback.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {pending.length === 0 && submitted.length === 0 && (
          <Card className="p-12 text-center">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No feedback available</h3>
            <p className="text-gray-600">Complete a trip to share your experience</p>
          </Card>
        )}
      </div>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getServiceColor(selectedFeedback.service).bg} rounded-xl flex items-center justify-center`}>
                    {(() => {
                      const ServiceIcon = getServiceIcon(selectedFeedback.service);
                      return <ServiceIcon className={`w-6 h-6 ${getServiceColor(selectedFeedback.service).text}`} />;
                    })()}
                  </div>
                  <div>
                    <h2>Rate Your {selectedFeedback.service} Experience</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedFeedback.bookingId}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Share your experience to help us improve our services
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Trip Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">From</p>
                      <p className="font-semibold">{selectedFeedback.from}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">To</p>
                      <p className="font-semibold">{selectedFeedback.to}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-semibold">{selectedFeedback.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Vendor</p>
                      <p className="font-semibold">{selectedFeedback.vendor}</p>
                    </div>
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="text-center py-4 bg-blue-50 rounded-lg">
                  <Label className="text-base mb-3 block">Overall Rating *</Label>
                  <div className="flex justify-center">
                    <StarRating
                      rating={selectedFeedback.overallRating}
                      onChange={(rating) => handleRatingChange('overall', rating)}
                    />
                  </div>
                  {selectedFeedback.overallRating > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedFeedback.overallRating === 5 && 'Excellent!'}
                      {selectedFeedback.overallRating === 4 && 'Very Good'}
                      {selectedFeedback.overallRating === 3 && 'Good'}
                      {selectedFeedback.overallRating === 2 && 'Fair'}
                      {selectedFeedback.overallRating === 1 && 'Poor'}
                    </p>
                  )}
                </div>

                {/* Category Ratings */}
                <div>
                  <Label className="text-base mb-3 block">Rate Each Category *</Label>
                  <div className="space-y-4">
                    {selectedFeedback.categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <StarRating
                          rating={category.rating}
                          onChange={(rating) => handleRatingChange('category', rating, category.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Would Recommend */}
                <div>
                  <Label className="text-base mb-3 block">Would you recommend this service? *</Label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedFeedback({ ...selectedFeedback, wouldRecommend: true })}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        selectedFeedback.wouldRecommend === true
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <ThumbsUp className={`w-8 h-8 mx-auto mb-2 ${
                        selectedFeedback.wouldRecommend === true ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <p className="font-medium text-gray-900">Yes</p>
                    </button>
                    <button
                      onClick={() => setSelectedFeedback({ ...selectedFeedback, wouldRecommend: false })}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        selectedFeedback.wouldRecommend === false
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <ThumbsDown className={`w-8 h-8 mx-auto mb-2 ${
                        selectedFeedback.wouldRecommend === false ? 'text-red-600' : 'text-gray-400'
                      }`} />
                      <p className="font-medium text-gray-900">No</p>
                    </button>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <Label htmlFor="comment" className="text-base mb-3 block">
                    Additional Comments <span className="text-gray-500 text-sm">(Optional)</span>
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Share more details about your experience..."
                    value={selectedFeedback.comment}
                    onChange={(e) => setSelectedFeedback({ ...selectedFeedback, comment: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRatingDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitFeedback}
                  className="bg-[#000035] hover:bg-[#000055]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Submitted Feedback Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-2xl">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getServiceColor(selectedFeedback.service).bg} rounded-xl flex items-center justify-center`}>
                    {(() => {
                      const ServiceIcon = getServiceIcon(selectedFeedback.service);
                      return <ServiceIcon className={`w-6 h-6 ${getServiceColor(selectedFeedback.service).text}`} />;
                    })()}
                  </div>
                  <div>
                    <h2>Your {selectedFeedback.service} Review</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedFeedback.bookingId}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Review your submitted feedback
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Trip Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">From</p>
                      <p className="font-semibold">{selectedFeedback.from}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">To</p>
                      <p className="font-semibold">{selectedFeedback.to}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-semibold">{selectedFeedback.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Vendor</p>
                      <p className="font-semibold">{selectedFeedback.vendor}</p>
                    </div>
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="text-center py-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Overall Rating</p>
                  <div className="flex justify-center mb-2">
                    <StarRating rating={selectedFeedback.overallRating} readonly />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{selectedFeedback.overallRating}.0</p>
                </div>

                {/* Category Ratings */}
                <div>
                  <p className="font-semibold mb-3">Category Ratings</p>
                  <div className="space-y-3">
                    {selectedFeedback.categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <StarRating rating={category.rating} readonly />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Would Recommend</p>
                  <div className="flex items-center gap-2">
                    {selectedFeedback.wouldRecommend ? (
                      <>
                        <ThumbsUp className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-700">Yes, I would recommend</span>
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-700">No, I would not recommend</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Comment */}
                {selectedFeedback.comment && (
                  <div>
                    <p className="font-semibold mb-2">Your Comment</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">"{selectedFeedback.comment}"</p>
                    </div>
                  </div>
                )}
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
    </div>
  );
}
