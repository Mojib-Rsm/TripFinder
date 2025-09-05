
export interface Amenity {
  name: string;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  amenities: Amenity[];
  reviews: Review[];
  gallery: string[];
  web_url?: string;
  styles?: string[];
  spoken_languages?: string[];
}

export interface Flight {
    id: string;
    origin: string;
    destination: string;
    origin_airport: string;
    destination_airport: string;
    price: number;
    airline: string;
    flight_number: string;
    departure_at: string;
    return_at: string;
    transfers: number;
    duration: number;
    link: string;
}
