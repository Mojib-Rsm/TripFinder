
// src/app/flights/page.tsx
import { getFlights } from "@/lib/data";
import { Flight } from "@/lib/types";
import { format } from 'date-fns';
import { Plane, ArrowRight, ExternalLink } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function FlightCard({ flight }: { flight: Flight }) {
  const partnerId = process.env.AVIASALES_PARTNER_ID;
  const flightLink = `https://www.aviasales.com/search/${flight.origin}${format(new Date(flight.departure_at), 'ddMM')}${flight.destination}${flight.return_at ? format(new Date(flight.return_at), 'ddMM') : ''}1?marker=${partnerId}`;

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-primary"/>
            <CardTitle className="text-lg">{flight.airline} {flight.flight_number}</CardTitle>
          </div>
          <div className="text-lg font-bold text-primary">
            ${flight.price}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl text-foreground">{flight.origin}</span>
            <span>{flight.origin_airport}</span>
          </div>
          <ArrowRight className="w-5 h-5"/>
          <div className="flex flex-col items-end">
            <span className="font-bold text-xl text-foreground">{flight.destination}</span>
            <span>{flight.destination_airport}</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm border-t pt-4">
            <div>
                <p><strong>Depart:</strong> {format(new Date(flight.departure_at), 'MMM d, yyyy HH:mm')}</p>
                {flight.return_at && <p><strong>Return:</strong> {format(new Date(flight.return_at), 'MMM d, yyyy HH:mm')}</p>}
            </div>
            <Button asChild>
                <Link href={flightLink} target="_blank" rel="noopener noreferrer">
                    Book Now <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function FlightsPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const { origin, destination, depart_date, return_date } = searchParams;

  if (!origin || !destination || !depart_date) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Invalid Search</h1>
        <p>Please provide origin, destination, and departure date.</p>
        <Button asChild className="mt-4">
            <Link href="/">Go back to search</Link>
        </Button>
      </div>
    );
  }

  let flights: Flight[] = [];
  let error: string | null = null;
  try {
     flights = await getFlights({ origin, destination, depart_date, return_date });
  } catch(e: any) {
    console.error(e);
    error = e.message || "An unknown error occurred while fetching flights.";
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Flight Results</h1>
        <p className="text-muted-foreground mb-8">
            Showing flights from {origin} to {destination}
        </p>

        {error && 
            <div className="p-4 rounded-md bg-destructive text-destructive-foreground text-center">
                <p className="font-bold mb-2">Error fetching flights</p>
                <p className="mb-4">{error}</p>
                 <Button asChild variant="secondary">
                    <Link href="/">Go back to search</Link>
                </Button>
            </div>
        }

        {!error && flights.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {flights.map(flight => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        ) : (
          !error && <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No flights found</h3>
            <p className="text-muted-foreground mt-2">
              We couldn't find any flights for the selected criteria. Try a different search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
