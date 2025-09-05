import { getHotelsByLocation } from "@/lib/data";
import { Hotel } from "@/lib/types";
import HotelCard from "@/components/hotel-card";
import AIRecommendations from "@/components/ai-recommendations";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const location = (searchParams.location as string) || "";

  const filteredHotels: Hotel[] = await getHotelsByLocation(location);

  const searchCriteria = location
    ? `hotels in ${location}`
    : "any highly rated hotel";

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold font-headline mb-2">
        {location ? `Hotels in ${location}` : "Popular Hotels"}
      </h2>
      <p className="text-muted-foreground mb-8">
        {filteredHotels.length} hotel(s) found.
      </p>

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
  );
}
