
import Image from "next/image";
import Link from "next/link";
import { Hotel } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { Button } from "./ui/button";

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
        <Link href={`/hotel/${hotel.id}`} className="group block">
            <div className="relative h-48 w-full">
            <Image
                src={hotel.gallery[0] || 'https://picsum.photos/400/300'}
                alt={hotel.name}
                data-ai-hint="hotel exterior"
                fill
                className="object-cover group-hover:scale-105 transition-transform"
            />
            </div>
            <CardHeader>
            <CardTitle className="truncate font-headline group-hover:text-primary">{hotel.name}</CardTitle>
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
                <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / night
                </span>
            </p>
            <Button asChild>
                <Link href={`/hotel/${hotel.id}`}>Book Now</Link>
            </Button>
        </CardFooter>
    </Card>
  );
};

export default HotelCard;
