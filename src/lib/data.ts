import type { Hotel } from "@/lib/types";

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "The Parisian Dream",
    description:
      "Experience the heart of Paris in this elegant hotel, blending classic French architecture with modern amenities. Just a stone's throw from the Eiffel Tower.",
    location: "Paris",
    price: 250,
    rating: 4.7,
    amenities: [
      { name: "Wi-Fi" },
      { name: "Restaurant" },
      { name: "Air Conditioning" },
      { name: "Fitness Center" },
    ],
    reviews: [
      {
        author: "Alice",
        rating: 5,
        comment: "Absolutely stunning hotel with breathtaking views. The service was impeccable.",
      },
      {
        author: "Bob",
        rating: 4,
        comment: "Great location and comfortable rooms. The breakfast could be better.",
      },
    ],
    gallery: [
      "https://picsum.photos/seed/paris1/800/600",
      "https://picsum.photos/seed/paris2/800/600",
      "https://picsum.photos/seed/paris3/800/600",
    ],
  },
  {
    id: "2",
    name: "Tokyo Skyline Hotel",
    description:
      "A modern marvel in the bustling city of Tokyo. Enjoy panoramic city views, a rooftop bar, and world-class service in Shinjuku.",
    location: "Tokyo",
    price: 300,
    rating: 4.9,
    amenities: [
      { name: "Wi-Fi" },
      { name: "Restaurant" },
      { name: "Air Conditioning" },
      { name: "Fitness Center" },
      { name: "Swimming Pool" },
    ],
    reviews: [
      {
        author: "Charlie",
        rating: 5,
        comment: "The view from my room was unbelievable. The staff were so friendly and helpful.",
      },
      {
        author: "Diana",
        rating: 5,
        comment: "Peak of luxury. The rooftop pool is a must-see. Worth every penny.",
      },
    ],
    gallery: [
      "https://picsum.photos/seed/tokyo1/800/600",
      "https://picsum.photos/seed/tokyo2/800/600",
      "https://picsum.photos/seed/tokyo3/800/600",
    ],
  },
  {
    id: "3",
    name: "New York Grand Central Inn",
    description:
      "Located in the heart of Manhattan, this hotel offers a perfect base for exploring the Big Apple. Comfortable, stylish, and convenient.",
    location: "New York",
    price: 350,
    rating: 4.5,
    amenities: [{ name: "Wi-Fi" }, { name: "Air Conditioning" }, { name: "TV" }],
    reviews: [
      {
        author: "Eve",
        rating: 4,
        comment: "You can't beat the location. Rooms are a bit small, but that's New York for you. Clean and modern.",
      },
      {
        author: "Frank",
        rating: 5,
        comment: "Perfect for a business trip. Fast Wi-Fi and close to everything. I'll be back.",
      },
    ],
    gallery: [
      "https://picsum.photos/seed/ny1/800/600",
      "https://picsum.photos/seed/ny2/800/600",
      "https://picsum.photos/seed/ny3/800/600",
    ],
  },
  {
    id: "4",
    name: "Rome Ancient Charm",
    description: "Stay in a beautifully restored historic building near the Colosseum. A unique blend of ancient history and modern comfort.",
    location: "Rome",
    price: 220,
    rating: 4.6,
    amenities: [{ name: "Wi-Fi" }, { name: "Air Conditioning" }, { name: "Restaurant" }],
    reviews: [
      {
        author: "Grace",
        rating: 5,
        comment: "Felt like stepping back in time, but with all modern comforts. The staff gave us great tips for local dining."
      },
      {
        author: "Heidi",
        rating: 4,
        comment: "Charming hotel, fantastic location. The room was lovely, though the street noise was a bit loud at night."
      }
    ],
    gallery: [
      "https://picsum.photos/seed/rome1/800/600",
      "https://picsum.photos/seed/rome2/800/600",
      "https://picsum.photos/seed/rome3/800/600",
    ]
  },
  {
    id: "5",
    name: "Parisian Budget Boutique",
    description: "A chic and affordable hotel in the trendy Le Marais district. Perfect for travelers who want style without the splurge.",
    location: "Paris",
    price: 150,
    rating: 4.3,
    amenities: [{ name: "Wi-Fi" }, { name: "Air Conditioning" }],
    reviews: [
        {
            author: "Ivan",
            rating: 4,
            comment: "Great value for money. The room was clean and stylish, and the location is fantastic for exploring."
        },
        {
            author: "Judy",
            rating: 4,
            comment: "Lovely little hotel. The staff was very welcoming. It's a great base for a Paris adventure."
        }
    ],
    gallery: [
        "https://picsum.photos/seed/paris4/800/600",
        "https://picsum.photos/seed/paris5/800/600",
    ]
  }
];
