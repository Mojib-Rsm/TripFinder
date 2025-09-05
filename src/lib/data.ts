import type { Hotel, Review } from "@/lib/types";

const TRIPADVISOR_API_KEY = process.env.TRIPADVISOR_API_KEY;
const BASE_URL = "https://api.content.tripadvisor.com/api/v1";

async function makeTripAdvisorRequest(endpoint: string, params: Record<string, string>) {
  if (!TRIPADVISOR_API_KEY) {
    throw new Error("TripAdvisor API key not configured");
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.search = new URLSearchParams(params).toString();
  url.searchParams.set("key", TRIPADVISOR_API_KEY);

  const response = await fetch(url.toString(), {
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error(`TripAdvisor API request failed: ${response.statusText}`);
  }

  return response.json();
}

// A cache to avoid re-fetching the same data multiple times in a single request.
const locationCache = new Map<string, any>();

async function getLocationDetails(locationId: string): Promise<any> {
    if (locationCache.has(locationId)) {
        return locationCache.get(locationId);
    }

    const details = await makeTripAdvisorRequest(`/location/${locationId}/details`, {
        language: "en",
        currency: "USD",
    });

    const photos = await makeTripAdvisorRequest(`/location/${locationId}/photos`, {
        language: "en",
    });
    details.photos = photos.data;

    const reviews = await makeTripAdvisorRequest(`/location/${locationId}/reviews`, {
        language: "en",
    });
    details.reviews = reviews.data;

    locationCache.set(locationId, details);

    return details;
}

function transformHotelData(details: any): Hotel {
    const amenities = details.amenities?.map((amenity: any) => ({ name: amenity.name })) || [];
    // Ensure basic amenities are present for consistency
    if (!amenities.find((a: any) => a.name === 'Wi-Fi')) amenities.push({ name: 'Wi-Fi'});
    if (!amenities.find((a: any) => a.name === 'Air Conditioning')) amenities.push({ name: 'Air Conditioning'});


    return {
        id: details.location_id,
        name: details.name || "Hotel name not available",
        description: details.description || "No description available.",
        location: details.address_obj?.city || details.address_obj?.country || "Location not available",
        price: details.price_level ? parseInt(details.price_level.replace(/[^0-9]/g, ''), 10) * 100 : 150,
        rating: parseFloat(details.rating) || 0,
        amenities,
        reviews: details.reviews?.map((review: any): Review => ({
            author: review.user.username,
            rating: parseInt(review.rating, 10),
            comment: review.text,
        })) || [],
        gallery: details.photos?.map((photo: any) => photo.images.large.url) || ['https://picsum.photos/800/600'],
    };
}


export async function getHotelsByLocation(searchQuery: string): Promise<Hotel[]> {
    if (!searchQuery) {
        // As a fallback, search for hotels in a popular destination if no query is provided.
        searchQuery = "New York";
    }

    const searchResults = await makeTripAdvisorRequest("/location/search", {
        searchQuery,
        category: "hotels",
        language: "en",
    });

    const hotelSummaries = searchResults.data;

    const hotels = await Promise.all(
        hotelSummaries.slice(0, 8).map(async (summary: any) => {
            try {
                const details = await getLocationDetails(summary.location_id);
                return transformHotelData(details);
            } catch (error) {
                console.error(`Failed to fetch details for location ${summary.location_id}:`, error);
                // Return a partial hotel object to avoid crashing the whole page
                return {
                    id: summary.location_id,
                    name: summary.name,
                    description: "Details could not be loaded.",
                    location: "Unknown",
                    price: 0,
                    rating: 0,
                    amenities: [],
                    reviews: [],
                    gallery: ['https://picsum.photos/800/600']
                }
            }
        })
    );

    return hotels.filter(h => h.name); // Filter out any hotels that failed to load
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
    { id: "254452" }, // Example: A hotel in New York
    { id: "187147" }, // Example: A hotel in Paris
    { id: "191259" }, // Example: A hotel in Tokyo
];
