
import { getHotelsByLocation } from "@/lib/data";
import HotelCard from "@/components/hotel-card";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";
import AiRecommendations from "@/components/ai-recommendations";
import Link from "next/link";

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: { location: string };
}) {
  const location = searchParams.location || "New York";
  const hotels = await getHotelsByLocation(location);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            {hotels.length > 0 ? (
                <p className="text-sm text-muted-foreground">
                    Showing {hotels.length} hotels in
                </p>
            ) : (
                <p className="text-sm text-muted-foreground">
                    Searching for hotels in
                </p>
            )}
            <h1 className="text-3xl font-bold font-headline">{location}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <AiRecommendations location={location} />
        
        {hotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
            ))}
            </div>
        ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg mt-8">
              <h3 className="text-xl font-semibold">No hotels found</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                We couldn't find any hotels matching your search for "{location}". Try a different search.
              </p>
              <Button asChild className="mt-4">
                <Link href="/">Go back to search</Link>
              </Button>
            </div>
        )}

      </div>
    </div>
  );
}
