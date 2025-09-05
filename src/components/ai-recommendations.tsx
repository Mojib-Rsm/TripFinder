
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Star } from "lucide-react";
import { getPersonalizedHotelRecommendations } from "@/ai/flows/personalized-hotel-recommendations";
import {
    type PersonalizedHotelRecommendationsInput,
    type PersonalizedHotelRecommendationsOutput
} from "@/ai/flows/personalized-hotel-recommendations-types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export default function AiRecommendations({ location }: { location: string }) {
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] =
    useState<PersonalizedHotelRecommendationsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendations(null);

    const input: PersonalizedHotelRecommendationsInput = {
      location,
      preferences,
    };

    try {
      const result = await getPersonalizedHotelRecommendations(input);
      setRecommendations(result);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <CardTitle className="text-primary">
            Get Personalized Hotel Recommendations
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Tell us what you're looking for, e.g., 'a quiet hotel with a pool for a family trip' or 'a budget-friendly option near the city center'."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            rows={3}
            className="bg-white"
          />
          <Button type="submit" disabled={loading || !preferences}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Recommendations...
              </>
            ) : (
              "Find My Perfect Hotel"
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-md bg-destructive/10 text-destructive-foreground">
            <p className="font-bold">Oops!</p>
            <p>{error}</p>
          </div>
        )}

        {recommendations && (
          <div className="mt-6 space-y-4">
            <p className="text-lg font-semibold">{recommendations.reasoning}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.hotels.map((hotel, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-4">
                    <h3 className="font-bold">{hotel.name}</h3>
                    <div className="flex items-center justify-between text-sm mt-2">
                       <Badge variant="secondary">${hotel.price}/night</Badge>
                       <div className="flex items-center gap-1">
                         <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                         <span className="font-medium">{hotel.rating}</span>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
