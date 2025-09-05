
import { getHotelById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Star,
  MapPin,
  Languages,
  ConciergeBell,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default async function HotelPage({
  params,
}: {
  params: { id: string };
}) {
  const hotel = await getHotelById(params.id);

  if (!hotel) {
    notFound();
  }
  
  const tripComPartnerId = process.env.TRIPCOM_PARTNER_ID || "12345";
  const bookingLink =
    hotel.web_url || `https://www.trip.com/hotels/detail?hotelId=${hotel.id}&cityId=1&checkIn=2024-09-15&checkOut=2024-09-16&adult=2&children=0&subpage=detail&partnerextid=${tripComPartnerId}`;


  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold font-headline">{hotel.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{hotel.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold">{hotel.rating}</span>
                {hotel.reviews?.length > 0 && <span>({hotel.reviews.length} reviews)</span>}
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <Carousel className="w-full">
            <CarouselContent>
              {hotel.gallery.slice(0, 5).map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[500px] w-full">
                    <Image
                      src={image}
                      alt={`${hotel.name} gallery image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      data-ai-hint="hotel interior"
                    />
                  </div>
                </CarouselItem>
              ))}
               {hotel.gallery.length === 0 && (
                <CarouselItem>
                  <div className="relative h-[500px] w-full">
                    <Image
                      src="https://picsum.photos/1200/500"
                      alt="Placeholder image"
                      fill
                      className="object-cover rounded-lg"
                      data-ai-hint="hotel building"
                    />
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About {hotel.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {hotel.description}
                  </p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.slice(0, 12).map((amenity) => (
                    <div key={amenity.name} className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Reviews */}
              {hotel.reviews?.length > 0 && (
                <Card>
                    <CardHeader>
                    <CardTitle>Guest Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    {hotel.reviews.slice(0, 3).map((review, index) => (
                        <div
                        key={index}
                        className="border-b pb-4 last:border-b-0"
                        >
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">{review.author}</p>
                            <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                key={i}
                                className={`w-4 h-4 ${
                                    i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                                />
                            ))}
                            </div>
                        </div>
                        <p className="text-muted-foreground italic">
                            "{review.comment}"
                        </p>
                        </div>
                    ))}
                    </CardContent>
                </Card>
              )}
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <p className="text-2xl font-bold">
                    BDT {hotel.price}{" "}
                    <span className="text-base font-normal text-muted-foreground">
                      / night
                    </span>
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {hotel.spoken_languages && hotel.spoken_languages.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Languages className="w-5 h-5 text-primary" />
                            <div>
                            <p className="font-semibold">Languages</p>
                            <p className="text-sm text-muted-foreground">
                                {hotel.spoken_languages.join(", ")}
                            </p>
                            </div>
                        </div>
                    )}
                    {hotel.styles && hotel.styles.length > 0 && (
                        <div className="flex items-center gap-2">
                            <ConciergeBell className="w-5 h-5 text-primary" />
                            <div>
                            <p className="font-semibold">Hotel Style</p>
                            <p className="text-sm text-muted-foreground">
                                {hotel.styles.join(", ")}
                            </p>
                            </div>
                        </div>
                    )}
                  <Button size="lg" className="w-full" asChild>
                    <Link
                      href={bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
