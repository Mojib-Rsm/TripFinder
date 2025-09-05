import { getHotelsByLocation } from "@/lib/data";
import { Hotel } from "@/lib/types";
import HotelCard from "@/components/hotel-card";
import AIRecommendations from "@/components/ai-recommendations";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Star, Users, Dog, Wallet } from "lucide-react";
import HotelSearchForm from "@/components/hotel-search-form";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const location = (searchParams.location as string) || "New York";

  const filteredHotels: Hotel[] = await getHotelsByLocation(location);

  const searchCriteria = location
    ? `hotels in ${location}`
    : "any highly rated hotel";

  return (
    <div className="bg-gray-50">
      <div className="bg-blue-600 py-4">
        <div className="container mx-auto">
          <HotelSearchForm />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-headline mb-4">
            Best-sellers: top hotels in {location}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" /> Preferred by families
            </Button>
            <Button variant="outline">
              <Dog className="mr-2 h-4 w-4" /> Pets Allowed
            </Button>
            <Button variant="outline">
              <Star className="mr-2 h-4 w-4" /> 5 Star
            </Button>
            <Button variant="outline">
              <Wallet className="mr-2 h-4 w-4" /> Budget
            </Button>
          </div>
        </div>

        {filteredHotels.length > 0 && (
          <AIRecommendations
            hotels={filteredHotels}
            searchCriteria={searchCriteria}
          />
        )}

        {filteredHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No hotels found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search criteria or searching for another location.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
