
import type { Hotel } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const bookingLink = `/hotel/${hotel.id}`;

  return (
    <Card key={hotel.id} className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
      <Link href={bookingLink} className="group block">
        <div className="relative h-48 w-full">
          <Image
            src={hotel.gallery[0] || "https://picsum.photos/400/300"}
            alt={hotel.name}
            data-ai-hint="hotel exterior"
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <CardHeader>
          <CardTitle className="truncate font-headline group-hover:text-primary">
            {hotel.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{hotel.location}</span>
            </div>
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
                ({hotel.reviews.length} reviews)
            </div>
        </CardContent>
      </Link>
      <CardFooter className="flex items-center justify-between">
         <p className="text-lg font-semibold text-foreground">
            ${hotel.price}
            <span className="text-sm font-normal text-muted-foreground"> / night</span>
        </p>
        <Button asChild>
            <Link href={bookingLink}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
