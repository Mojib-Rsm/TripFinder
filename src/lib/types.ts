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
}
