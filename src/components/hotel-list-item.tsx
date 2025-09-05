
import Image from "next/image";
import Link from "next/link";
import { Hotel } from "@/lib/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { Button } from "./ui/button";

interface HotelListItemProps {
  hotel: Hotel;
  reason?: string;
}

const HotelListItem = ({ hotel, reason }: HotelListItemProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl bg-card">
        <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 lg:col-span-3">
                <div className="relative h-48 md:h-full w-full">
                <Image
                    src={hotel.gallery[0] || 'https://picsum.photos/400/300'}
                    alt={hotel.name}
                    data-ai-hint="hotel exterior"
                    fill
                    className="object-cover"
                />
                </div>
            </div>
            <div className="md:col-span-5 lg:col-span-6 p-6 flex flex-col justify-center">
                 <h2 className="text-2xl font-bold font-headline mb-2">{hotel.name}</h2>
                 <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                            key={i}
                            className={`w-5 h-5 ${
                                i < Math.round(hotel.rating)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{hotel.reviews.length} reviews</span>
                 </div>
                 {reason && (
                    <p className="text-sm text-primary font-semibold mb-2">{reason}</p>
                 )}
                 <div className="mt-auto pt-4">
                    <Button asChild variant="link" className="p-0">
                        <Link href={`/hotel/${hotel.id}`}>View hotel website</Link>
                    </Button>
                 </div>
            </div>
            <div className="md:col-span-3 p-6 flex flex-col justify-center items-center md:items-end text-right border-t md:border-t-0 md:border-l">
                <div className="mb-4">
                    <p className="text-sm text-muted-foreground">from</p>
                    <p className="text-3xl font-bold text-foreground">
                        ${hotel.price}
                    </p>
                </div>
                 <Button asChild size="lg" className="w-full md:w-auto">
                    <Link href={`/hotel/${hotel.id}`}>Check availability</Link>
                </Button>
            </div>
        </div>
    </Card>
  );
};

export default HotelListItem;
