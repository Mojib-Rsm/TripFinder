// src/app/api/hotels/route.ts
import { getHotelsByLocation } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || '';
  try {
    const hotels = await getHotelsByLocation(location);
    return NextResponse.json(hotels);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ message: 'Error fetching hotels' }, { status: 500 });
  }
}
