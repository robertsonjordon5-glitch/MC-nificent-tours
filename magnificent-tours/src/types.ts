export interface AirportTransferZone {
  id: string;
  name: string;
  region: string;
  description: string;
  hotels: string[];
  oneWayPrice4Pax: number;
  roundTripPrice4Pax: number;
  oneWayExtraPax: number;
  roundTripExtraPax: number;
}

export interface SightseeingTour {
  id: string;
  name: string;
  tagline: string;
  description: string;
  pricePerAdult: number;
  pricePerChild: number;
  minPax: number;
  duration: string;
  included: string[];
  image: string;
  category: 'Popular' | 'Water' | 'Heritage' | 'Adventure';
}

export interface BookingDetails {
  bookingType: 'transfer' | 'tour' | 'both';
  
  // Transfer Details
  transferZoneId: string;
  hotelName: string;
  transferPaxCount: number;
  tripType: 'one-way' | 'round-trip';
  arrivalFlight: string;
  arrivalDateTime: string;
  departureFlight: string;
  departureDateTime: string;
  
  // Custom Transfer Destination (if hotel not listed)
  customDestinationName: string;

  // Selected Tours Details
  selectedTourIds: string[];
  tourPaxRecord: {
    [tourId: string]: {
      adults: number;
      children: number;
    };
  };

  // Lead contact information
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  specialInstructions: string;
}
