// src/app/api/flights/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { Flight } from '@/lib/types';

const AVIASALES_API_KEY = process.env.AVIASALES_API_KEY;
const AVIASALES_API_URL = 'https://api.travelpayouts.com/v2/prices/latest';

export async function GET(request: NextRequest) {
  if (!AVIASALES_API_KEY) {
    return NextResponse.json({ message: 'Aviasales API key is not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const depart_date = searchParams.get('depart_date');
  const return_date = searchParams.get('return_date');

  if (!origin || !destination || !depart_date) {
    return NextResponse.json({ message: 'Missing required search parameters' }, { status: 400 });
  }

  const apiParams: Record<string, string> = {
    origin,
    destination,
    depart_date,
    token: AVIASALES_API_KEY,
    currency: 'usd',
    limit: '20'
  };

  if (return_date) {
    apiParams.return_date = return_date;
  }

  try {
    const response = await fetch(`${AVIASALES_API_URL}?${new URLSearchParams(apiParams)}`);
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Aviasales API error:', errorText);
        return NextResponse.json({ message: `Error from Aviasales API: ${response.statusText}`}, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
        return NextResponse.json({ message: 'No flights found or invalid data from API' }, { status: 404 });
    }

    const flights: Flight[] = data.data.map((flight: any) => ({
      id: `${flight.origin}-${flight.destination}-${flight.flight_number}-${flight.departure_at}`,
      origin: flight.origin,
      destination: flight.destination,
      origin_airport: flight.origin_airport,
      destination_airport: flight.destination_airport,
      price: flight.price,
      airline: flight.airline,
      flight_number: flight.flight_number,
      departure_at: flight.departure_at,
      return_at: flight.return_at,
      transfers: flight.transfers,
      duration: flight.duration,
      link: flight.link,
    }));
    
    return NextResponse.json(flights);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ message: 'Error fetching flights' }, { status: 500 });
  }
}
