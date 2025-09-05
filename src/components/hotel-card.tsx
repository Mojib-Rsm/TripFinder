
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

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  return (
    <Link href={`/hotel/${hotel.id}`} className="group">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
        <div className="relative h-48 w-full">
          <Image
            src={hotel.gallery[0]}
            alt={hotel.name}
            data-ai-hint="hotel exterior"
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle className="truncate font-headline">{hotel.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{hotel.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-lg font-semibold text-foreground">
            ৳{hotel.price}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / night
            </span>
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default HotelCard;
