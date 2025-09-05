
// src/app/api/airports/route.ts
import { NextRequest, NextResponse } from 'next/server';

const AVIASALES_API_URL = 'https://api.travelpayouts.com/data/en/cities.json';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(AVIASALES_API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch airport data from Aviasales');
    }
    const airports = await response.json();
    
    const filteredAirports = airports.filter((airport: any) => 
        (airport.name && airport.name.toLowerCase().includes(query.toLowerCase())) ||
        (airport.code && airport.code.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 10);

    return NextResponse.json(filteredAirports);

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
