
export type ItineraryStatus = 'Draft' | 'Active' | 'Completed';
export type ActivityType = 'destination' | 'hotel' | 'tour' | 'transport' | 'custom';
export type BookingStatus = 'Booked' | 'Not Booked' | 'Pending';

export interface Activity {
  id: string;
  time: string;
  type: ActivityType;
  title: string;
  description: string;
  cost: number;
  status: BookingStatus;
  provider?: string;
  imageUrl?: string;
  duration?: string;
  location?: string;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  type: 'Cultural' | 'Beach' | 'Adventure' | 'Honeymoon' | 'Family' | 'Custom';
  status: ItineraryStatus;
  coverImage: string;
  destinationsCount: number;
  hotelsCount: number;
  toursCount: number;
  days: DayPlan[];
}
