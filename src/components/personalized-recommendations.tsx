"use client";

import { useEffect, useState } from "react";
import { useSearchHistory } from "@/hooks/use-search-history";
import {
  personalizedHotelRecommendations,
  type PersonalizedHotelRecommendationsOutput,
} from "@/ai/flows/personalized-hotel-recommendations";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Image from "next/image";
import { Hotel } from "@/lib/types";


const PersonalizedRecommendations = () => {
  const { history } = useSearchHistory();
  const [recommendations, setRecommendations] =
    useState<PersonalizedHotelRecommendationsOutput | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRecommendations = async () => {
      if (history.length > 0) {
        setIsLoading(true);
        setError(null);
        try {
          // Since we can't get all hotels from TripAdvisor easily,
          // let's fetch a sample based on the user's most recent search.
          const recentSearchLocation = history[0].location;
          const response = await fetch(`/api/hotels?location=${recentSearchLocation}`);
          const fetchedHotels: Hotel[] = await response.json();
          setHotels(fetchedHotels);

          if (fetchedHotels.length > 0) {
            const userHistoryForAI = history.map((h) => ({
              location: h.location,
              dates: `From: ${
                h.dates.from?.toDateString() || "N/A"
              } To: ${h.dates.to?.toDateString() || "N/A"}`,
              preferences: "User is looking for highly rated hotels.",
            }));

            const hotelDetailsForAI = fetchedHotels.map((h) => ({
              hotelName: h.name,
              hotelDescription: h.description,
              rating: h.rating,
              review: h.reviews[0]?.comment || "No reviews yet.",
            }));

            const result = await personalizedHotelRecommendations({
              userHistory: userHistoryForAI,
              hotelDetails: hotelDetailsForAI,
            });
            setRecommendations(result);
          }
        } catch (e) {
          console.error(e);
          setError("Could not fetch personalized recommendations.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    getRecommendations();
  }, [history]);

  if (history.length === 0) {
    return null;
  }

  const recommendedHotels =
    recommendations?.recommendations
      .map((rec) => {
        const hotel = hotels.find((h) => h.name === rec.hotelName);
        return { ...rec, hotel };
      })
      .filter((item) => item.hotel) ?? [];

  return (
    <section className="py-12 md:py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-primary" />
          <h3 className="text-3xl font-bold font-headline">Just For You</h3>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-10">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p>Generating personalized recommendations...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading &&
          recommendedHotels &&
          recommendedHotels.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedHotels.map(
                ({ hotel, reason }) =>
                  hotel && (
                    <Card
                      key={hotel.id}
                      className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={hotel.gallery[0]}
                          alt={hotel.name}
                          data-ai-hint="hotel room"
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{hotel.name}</CardTitle>
                        <CardDescription className="pt-2 text-base">
                          {reason}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground">
                          Location: {hotel.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rating: {hotel.rating} / 5
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link href={`/hotel/${hotel.id}`}>View Hotel</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  )
              )}
            </div>
          )}
      </div>
    </section>
  );
};

export default PersonalizedRecommendations;
