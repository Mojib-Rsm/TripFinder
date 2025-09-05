
import type { Hotel, Review, Flight } from '@/lib/types';
import { format } from 'date-fns';
import { findNearbyAirportsFlow } from '@/ai/flows/nearby-airport-tool';

const AVIASALES_API_KEY = process.env.AVIASALES_API_KEY;
const AVIASALES_PARTNER_ID = process.env.AVIASALES_PARTNER_ID || '592431';
const TRIPADVISOR_API_KEY = process.env.TRIPADVISOR_API_KEY;
const TRIPADVISOR_API_URL = 'https://api.tripadvisor.com/api/internal/v1';

async function makeTripAdvisorRequest(endpoint: string, params: URLSearchParams) {
  if (!TRIPADVISOR_API_KEY || TRIPADVISOR_API_KEY === 'YOUR_TRIPADVISOR_API_KEY') {
    console.warn(
      'TripAdvisor API key not found or is a placeholder. Using mock data. Please add a valid TRIPADVISOR_API_KEY to your .env file.'
    );
    return null;
  }

  params.set('key', TRIPADVISOR_API_KEY);
  const response = await fetch(`${TRIPADVISOR_API_URL}${endpoint}?${params.toString()}`, {
    method: 'GET',
    headers: { accept: 'application/json' },
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error(`TripAdvisor API request failed: ${response.statusText}`);
  }

  return response.json();
}

async function getLocationDetails(locationId: string) {
  const params = new URLSearchParams({
    language: 'en',
    currency: 'USD',
  });
  return makeTripAdvisorRequest(`/location/${locationId}/details`, params);
}

async function getLocationPhotos(locationId: string) {
  const params = new URLSearchParams({
    language: 'en',
    limit: '10',
  });
  return makeTripAdvisorRequest(`/location/${locationId}/photos`, params);
}

async function getLocationReviews(locationId: string) {
  const params = new URLSearchParams({
    language: 'en',
    limit: '5',
  });
  return makeTripAdvisorRequest(`/location/${locationId}/reviews`, params);
}

const mockAmenities: { name: string }[] = [
  { name: 'Wi-Fi' },
  { name: 'Air Conditioning' },
  { name: 'Pool' },
  { name: 'Restaurant' },
  { name: 'Parking' },
  { name: 'Fitness Center' },
  { name: 'Bar' },
  { name: '24-hour front desk' },
  { name: 'Room service' },
];

const mockReviews: Review[] = [
  { author: 'Jane D.', rating: 5, comment: 'Absolutely wonderful stay! The staff was amazing.' },
  { author: 'John S.', rating: 4, comment: 'Great location and very clean rooms. The breakfast could be better.' },
  { author: 'Emily R.', rating: 5, comment: 'Perfect for a family vacation. The pool was a huge hit with the kids.' },
];

const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Seaside Resort & Spa',
    description: 'A luxurious resort offering stunning ocean views, a world-class spa, and gourmet dining options. Perfect for a relaxing getaway.',
    location: "Cox's Bazar",
    price: 250,
    rating: 4.8,
    amenities: mockAmenities,
    reviews: mockReviews,
    gallery: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3',
      'https://picsum.photos/800/600?random=4',
    ],
    web_url: '#',
    styles: ['Luxury', 'Beachfront'],
    spoken_languages: ['English', 'Bengali'],
  },
  {
    id: '2',
    name: 'The Grand City Hotel',
    description: 'Located in the heart of the city, this hotel offers modern amenities and easy access to major attractions and business districts.',
    location: 'Dhaka',
    price: 180,
    rating: 4.5,
    amenities: mockAmenities,
    reviews: mockReviews,
    gallery: [
      'https://picsum.photos/800/600?random=5',
      'https://picsum.photos/800/600?random=6',
    ],
    web_url: '#',
    styles: ['Business', 'Modern'],
    spoken_languages: ['English', 'Bengali'],
  },
  {
    id: '3',
    name: 'Bangkok Oasis Suites',
    description: 'An urban oasis with spacious suites, a rooftop pool, and vibrant nightlife just steps away.',
    location: 'Bangkok',
    price: 150,
    rating: 4.6,
    amenities: mockAmenities,
    reviews: mockReviews,
    gallery: [
      'https://picsum.photos/800/600?random=7',
      'https://picsum.photos/800/600?random=8',
    ],
    web_url: '#',
    styles: ['Boutique', 'City Center'],
    spoken_languages: ['English', 'Thai'],
  },
  {
    id: '4',
    name: 'Dubai Skyscraper Views',
    description: 'Experience unparalleled luxury with breathtaking views of the Dubai skyline from every room.',
    location: 'Dubai',
    price: 450,
    rating: 4.9,
    amenities: mockAmenities,
    reviews: mockReviews,
    gallery: [
      'https://picsum.photos/800/600?random=9',
      'https://picsum.photos/800/600?random=10',
    ],
    web_url: '#',
    styles: ['Skyscraper', 'Ultra-Luxury'],
    spoken_languages: ['English', 'Arabic'],
  },
];


export async function getHotelsByLocation(
  searchQuery: string
): Promise<Hotel[]> {
  const searchParams = new URLSearchParams({
    searchQuery,
    category: 'hotels',
    language: 'en',
  });
  const searchResults = await makeTripAdvisorRequest('/location/search', searchParams);
  
  if (!searchResults || !searchResults.data) {
    return Promise.resolve(mockHotels.filter(h => h.location.toLowerCase() === searchQuery.toLowerCase()));
  }

  const hotelData = searchResults.data.slice(0, 4);

  const hotels = await Promise.all(
    hotelData.map(async (hotel: any) => {
      const [details, photos, reviews] = await Promise.all([
        getLocationDetails(hotel.locationId),
        getLocationPhotos(hotel.locationId),
        getLocationReviews(hotel.locationId),
      ]);

      if (!details) return null;

      return {
        id: hotel.locationId,
        name: details.name || 'No name',
        description: details.description || 'No description available.',
        location: details.address_obj?.city || details.address_obj?.address_string || 'Unknown location',
        price: parseInt(details.price_level?.replace(/[^0-9]/g, ''), 10) * 100 || 150,
        rating: details.rating || 0,
        amenities: details.amenities?.map((a: any) => ({ name: a.name })) || [],
        reviews: reviews?.data?.map((r: any) => ({
          author: r.user.username,
          rating: r.rating,
          comment: r.text,
        })) || [],
        gallery: photos?.data?.map((p: any) => p.images.large.url) || [],
        web_url: details.web_url,
        styles: details.styles,
        spoken_languages: details.spoken_languages?.map((l: any) => l.name) || [],
      };
    })
  );

  return hotels.filter((hotel): hotel is Hotel => hotel !== null);
}

export async function getHotelById(hotelId: string): Promise<Hotel | null> {
    const [details, photos, reviews] = await Promise.all([
      getLocationDetails(hotelId),
      getLocationPhotos(hotelId),
      getLocationReviews(hotelId),
    ]);

    if (!details) {
      const mockHotel = mockHotels.find(h => h.id === hotelId);
      return Promise.resolve(mockHotel || null);
    }
    
    return {
      id: hotelId,
      name: details.name || 'No name',
      description: details.description || 'No description available.',
      location: details.address_obj?.city || details.address_obj?.address_string || 'Unknown location',
      price: parseInt(details.price_level?.replace(/[^0-9]/g, ''), 10) * 100 || 150,
      rating: details.rating || 0,
      amenities: details.amenities?.map((a: any) => ({ name: a.name })) || [],
      reviews: reviews?.data?.map((r: any) => ({
        author: r.user.username,
        rating: r.rating,
        comment: r.text,
      })) || [],
      gallery: photos?.data?.map((p: any) => p.images.large.url) || [],
      web_url: details.web_url,
      styles: details.styles,
      spoken_languages: details.spoken_languages?.map((l: any) => l.name) || [],
    };
}

// The following functions are to support generateStaticParams, which requires a non-dynamic data source.
// We'll keep a small, static list for this purpose.
export const staticHotelsForParamGeneration = mockHotels.map(h => ({id: h.id}));

// Flights
async function startFlightSearch(params: {
  origin: string;
  destination: string;
  depart_date: string;
  return_date?: string;
}) {
  if (!AVIASALES_API_KEY) {
    throw new Error('Aviasales API key is not configured');
  }

  const response = await fetch('https://api.travelpayouts.com/v1/flight_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': AVIASALES_API_KEY,
    },
    body: JSON.stringify({
      marker: AVIASALES_PARTNER_ID,
      passengers: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segments: [
        {
          origin: params.origin,
          destination: params.destination,
          date: params.depart_date,
        },
        ...(params.return_date
          ? [
              {
                origin: params.destination,
                destination: params.origin,
                date: params.return_date,
              },
            ]
          : []),
      ],
      trip_class: 'Y', // Y: Economy, C: Business, F: First
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Aviasales flight search initiation error:', errorText);
    throw new Error('Failed to start flight search.');
  }

  const result = await response.json();
  return result.search_id;
}


async function getFlightSearchResults(searchId: string): Promise<Flight[]> {
  const response = await fetch(
    `https://api.travelpayouts.com/v1/flight_search_results?uuid=${searchId}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Aviasales flight search results error:', errorText);
    throw new Error('Failed to fetch flight search results.');
  }

  const data = await response.json();

  if (!data.proposals || data.proposals.length === 0) {
    return [];
  }

  const flights: Flight[] = data.proposals.map((flightData: any) => {
    return {
      id: flightData.proposal_id,
      origin: flightData.segments[0].origin,
      destination: flightData.segments[0].destination,
      price: flightData.price.amount,
      airline: flightData.validating_carrier, // This might need mapping to a name
      departure_at: flightData.segments[0].departure,
      return_at: flightData.segments[1]?.departure,
      link: flightData.deeplink_url,
      // The new API doesn't directly provide all the same fields as the old one.
      // We will have to adapt or omit them.
      origin_airport: flightData.segments[0].origin,
      destination_airport: flightData.segments[0].destination,
      flight_number: flightData.segments[0].flight_number,
      transfers: flightData.segments.reduce((acc: number, curr: any) => acc + (curr.stops || 0), -1),
      duration: 0, // Not provided directly
    };
  });
  
  return flights;
}

export async function getFlights(params: {
  origin: string;
  destination: string;
  depart_date: string;
  return_date?: string;
}): Promise<{
  flights: Flight[];
  alternativeOrigin?: any;
  alternativeDestination?: any;
}> {
  try {
    const searchId = await startFlightSearch(params);
    let flights: Flight[] = [];
    let attempts = 0;
    
    // Poll for results
    while (flights.length === 0 && attempts < 5) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
      const results = await getFlightSearchResults(searchId);
      if (results.length > 0) {
          flights = results;
          break;
      }
      attempts++;
    }

    if (flights.length === 0) {
      const [alternativeOrigin, alternativeDestination] = await Promise.all([
        findNearbyAirportsFlow({ airportCode: params.origin }),
        findNearbyAirportsFlow({ airportCode: params.destination }),
      ]);
      return { flights: [], alternativeOrigin, alternativeDestination };
    }

    // Add full airport names
    const flightsWithAirportNames = await Promise.all(
        flights.map(async (flight) => {
        const [originAirport, destinationAirport] = await Promise.all([
            getAirportName(flight.origin),
            getAirportName(flight.destination),
        ]);
        return {
            ...flight,
            origin_airport: originAirport,
            destination_airport: destinationAirport,
        };
        })
    );


    return { flights: flightsWithAirportNames };
  } catch (error) {
    console.error('Error in getFlights:', error);
    // Return empty results and no alternatives on a hard error
    return { flights: [] };
  }
}

// Caching airport data to avoid repeated API calls
const airportDataCache = new Map<string, string>();

async function getAirportName(iataCode: string): Promise<string> {
  if (airportDataCache.has(iataCode)) {
    return airportDataCache.get(iataCode) as string;
  }

  try {
    const response = await fetch(
      `https://api.travelpayouts.com/data/en/airports.json`
    );
    if (!response.ok) return iataCode; // Fallback to IATA code

    const airports = await response.json();
    const airport = airports.find((a: any) => a.code === iataCode);
    const airportName = airport ? `${airport.name} (${iataCode})` : iataCode;

    airportDataCache.set(iataCode, airportName);
    return airportName;
  } catch (error) {
    console.error(`Could not fetch airport name for ${iataCode}:`, error);
    return iataCode; // Fallback to IATA code on error
  }
}
