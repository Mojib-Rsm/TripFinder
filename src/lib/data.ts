
import type { Hotel, Review, Flight } from '@/lib/types';
import { format } from 'date-fns';
import { findNearbyAirportsFlow } from '@/ai/flows/nearby-airport-tool';

const AVIASALES_API_KEY = process.env.AVIASALES_API_KEY;
const AVIASALES_PARTNER_ID = process.env.AVIASALES_PARTNER_ID;
const TRIPADVISOR_BASE_URL = 'https://api.content.tripadvisor.com/api/v1';
const AVIASALES_API_URL = 'https://api.travelpayouts.com/v2/prices/latest';

// A module-level cache to avoid re-fetching the same data multiple times across requests.
const locationCache = new Map<string, any>();

async function makeTripAdvisorRequest(
  endpoint: string,
  params: Record<string, string>
) {
    // This is a mock implementation that returns placeholder data
    console.warn("TripAdvisor API key not configured. Returning mock data.");
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint.includes('search')) {
          resolve({
            data: Array.from({ length: 10 }, (_, i) => ({
              location_id: `${i + 1}`,
              name: `Hotel Resort #${i + 1}`,
            })),
          });
        } else if (endpoint.includes('photos')) {
          resolve({
            data: Array.from({ length: 5 }, (_, i) => ({
              images: {
                large: { url: `https://picsum.photos/800/600?random=${i}` },
              },
            })),
          });
        } else if (endpoint.includes('reviews')) {
          resolve({
            data: Array.from({ length: 5 }, (_, i) => ({
              user: { username: `user${i}`},
              rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
              text: `This is a sample review #${i + 1}. The stay was pleasant.`,
            })),
          });
        } else { // details
          const locationId = endpoint.split('/')[2];
          resolve({
            location_id: locationId,
            name: `Hotel #${locationId} Name`,
            description: `This is a detailed description for Hotel #${locationId}. It offers great amenities and a comfortable stay.`,
            address_obj: { city: 'Dreamville', country: 'Fantasyland' },
            price_level: '$50-$150',
            rating: (Math.random() * 2 + 3).toFixed(1),
            amenities: [{name: 'Free Wifi'}, {name: 'Swimming Pool'}, {name: 'Gym'}, {name: 'Parking'}],
            web_url: 'https://www.tripadvisor.com',
            hotel_class: '4 star',
            styles: ['Modern', 'Family-friendly'],
            spoken_languages: ['English', 'Spanish'],
          });
        }
      }, 500);
    });
}

async function getLocationDetails(locationId: string): Promise<any> {
  if (locationCache.has(locationId)) {
    return locationCache.get(locationId);
  }

  const details = await makeTripAdvisorRequest(`/location/${locationId}/details`, {
    language: 'en',
  });

  const photos = await makeTripAdvisorRequest(`/location/${locationId}/photos`, {
    language: 'en',
  });
  details.photos = photos.data;

  const reviews = await makeTripAdvisorRequest(`/location/${locationId}/reviews`, {
    language: 'en',
  });
  details.reviews = reviews.data;

  locationCache.set(locationId, details);

  return details;
}

function parsePrice(priceLevel?: string): number {
  if (!priceLevel) return 50; // Default price

  // Example price level might be "$50-$100"
  const priceRange = priceLevel
    .replace(/[^0-9-]/g, '')
    .split('-')
    .map((p) => parseInt(p, 10));

  if (priceRange.length > 1 && !isNaN(priceRange[0]) && !isNaN(priceRange[1])) {
    // Return an average if it's a range
    return (priceRange[0] + priceRange[1]) / 2;
  }

  if (priceRange.length === 1 && !isNaN(priceRange[0])) {
    // Return the number if it's a single value
    return priceRange[0];
  }

  return 50; // Fallback default price
}

function transformHotelData(details: any): Hotel {
  const amenities =
    details.amenities
      ?.map((amenity: any) => ({ name: amenity.name }))
      .filter((amenity: any) => amenity.name) || [];
  // Ensure basic amenities are present for consistency
  if (!amenities.find((a: any) => a.name === 'Wi-Fi'))
    amenities.push({ name: 'Wi-Fi' });
  if (!amenities.find((a: any) => a.name === 'Air Conditioning'))
    amenities.push({ name: 'Air Conditioning' });

  return {
    id: details.location_id,
    name: details.name || 'Hotel name not available',
    description: details.description || 'No description available.',
    location:
      details.address_obj?.city ||
      details.address_obj?.country ||
      'Location not available',
    price: parsePrice(details.price_level),
    rating: parseFloat(details.rating) || 0,
    amenities,
    reviews:
      details.reviews?.map(
        (review: any): Review => ({
          author: review.user.username,
          rating: parseInt(review.rating, 10),
          comment: review.text,
        })
      ) || [],
    gallery: details.photos?.map((photo: any) => photo.images.large.url) || [
      'https://picsum.photos/800/600',
    ],
    web_url: details.web_url,
    styles:
      details.hotel_class?.split(',').map((s: string) => s.trim()) ||
      details.styles?.map((style: any) => style.name),
    spoken_languages: details.spoken_languages?.map((lang: any) => lang.name),
  };
}

export async function getHotelsByLocation(
  searchQuery: string
): Promise<Hotel[]> {
  if (!searchQuery) {
    // As a fallback, search for hotels in a popular destination if no query is provided.
    searchQuery = 'New York';
  }

  const searchResults = await makeTripAdvisorRequest('/location/search', {
    searchQuery,
    category: 'hotels',
    language: 'en',
  });

  const hotelSummaries = searchResults.data;

  const hotels = await Promise.all(
    hotelSummaries.slice(0, 4).map(async (summary: any) => {
      try {
        const details = await getLocationDetails(summary.location_id);
        return transformHotelData(details);
      } catch (error) {
        console.error(
          `Failed to fetch details for location ${summary.location_id}:`,
          error
        );
        // Return a partial hotel object to avoid crashing the whole page
        return {
          id: summary.location_id,
          name: summary.name,
          description: 'Details could not be loaded.',
          location: 'Unknown',
          price: 0,
          rating: 0,
          amenities: [],
          reviews: [],
          gallery: ['https://picsum.photos/800/600'],
        };
      }
    })
  );

  return hotels.filter((h) => h.name); // Filter out any hotels that failed to load
}

export async function getHotelById(hotelId: string): Promise<Hotel | null> {
  try {
    const details = await getLocationDetails(hotelId);
    return transformHotelData(details);
  } catch (error) {
    console.error(`Failed to fetch hotel with id ${hotelId}:`, error);
    return null;
  }
}

// The following functions are to support generateStaticParams, which requires a non-dynamic data source.
// We'll keep a small, static list for this purpose.
export const staticHotelsForParamGeneration = [
  { id: '254452' }, // Example: A hotel in New York
  { id: '187147' }, // Example: A hotel in Paris
  { id: '191259' }, // Example: A hotel in Tokyo
];

// Flights
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
  if (!AVIASALES_API_KEY) {
    throw new Error('Aviasales API key is not configured');
  }

  const apiParams: Record<string, string> = {
    ...params,
    token: AVIASALES_API_KEY,
    currency: 'usd',
    limit: '20',
  };

  try {
    const response = await fetch(
      `${AVIASALES_API_URL}?${new URLSearchParams(apiParams)}`
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Aviasales API error:', errorText);
      throw new Error(`Error from Aviasales API: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success || !data.data || data.data.length === 0) {
      // If no flights, check for nearby airports
      const [alternativeOrigin, alternativeDestination] = await Promise.all([
        findNearbyAirportsFlow({ airportCode: params.origin }),
        findNearbyAirportsFlow({ airportCode: params.destination }),
      ]);
      return { flights: [], alternativeOrigin, alternativeDestination };
    }

    const flights: Flight[] = await Promise.all(
      data.data.map(async (flight: any) => {
        const [originAirport, destinationAirport] = await Promise.all([
          getAirportName(flight.origin_airport),
          getAirportName(flight.destination_airport),
        ]);

        return {
          id: `${flight.origin}-${flight.destination}-${flight.flight_number}-${flight.departure_at}`,
          origin: flight.origin,
          destination: flight.destination,
          origin_airport: originAirport,
          destination_airport: destinationAirport,
          price: flight.price,
          airline: flight.airline,
          flight_number: flight.flight_number,
          departure_at: flight.departure_at,
          return_at: flight.return_at,
          transfers: flight.transfers,
          duration: flight.duration,
          link: flight.link,
        };
      })
    );

    return { flights };
  } catch (error) {
    console.error('Error in getFlights:', error);
    throw new Error('Error fetching flights');
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
