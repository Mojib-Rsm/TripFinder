import { hotelRecommendationTool } from "@/ai/flows/hotel-recommendation-tool";
import { Hotel } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface AIRecommendationsProps {
  hotels: Hotel[];
  searchCriteria: string;
}

export default async function AIRecommendations({
  hotels,
  searchCriteria,
}: AIRecommendationsProps) {
  if (hotels.length < 3) {
    return null;
  }

  let recommendations = null;
  try {
    const hotelDetailsForAI = hotels.map((h) => ({
      name: h.name,
      rating: h.rating,
      reviews: h.reviews.map((r) => r.comment),
      location: h.location,
      price: h.price,
    }));

    recommendations = await hotelRecommendationTool({
      hotelDetails: hotelDetailsForAI,
      searchCriteria: searchCriteria,
    });
  } catch (error) {
    console.error("Failed to get AI recommendations:", error);
    return (
      <div className="mb-8">
        <Alert variant="destructive">
          <AlertTitle>AI Recommendation Error</AlertTitle>
          <AlertDescription>
            Could not fetch AI-powered recommendations at this time.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!recommendations || recommendations.recommendations.length === 0) {
    return null;
  }

  const recommendedHotels = recommendations.recommendations
    .slice(0, 3)
    .map((rec) => {
      const hotel = hotels.find((h) => h.name === rec.name);
      return { ...rec, hotel };
    })
    .filter((item) => item.hotel);

  return (
    <div className="mb-12 p-6 bg-accent/50 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-bold font-headline">Top AI Picks For You</h3>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedHotels.map(
          ({ hotel, reason }) =>
            hotel && (
              <Card key={hotel.id} className="bg-card shadow-md">
                <CardHeader>
                  <CardTitle>{hotel.name}</CardTitle>
                  <CardDescription className="!mt-2 pt-2 border-t">
                    {reason}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/hotel/${hotel.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            )
        )}
      </div>
    </div>
  );
}
