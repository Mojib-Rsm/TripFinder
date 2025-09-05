import { getHotelById, staticHotelsForParamGeneration } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Star,
  Wifi,
  ParkingSquare,
  UtensilsCrossed,
  Wind,
  Dumbbell,
  Waves,
  Tv,
  Check,
  Globe,
  Building,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const amenityIcons: { [key: string]: React.ReactNode } = {
  "Wi-Fi": <Wifi className="w-5 h-5" />,
  Parking: <ParkingSquare className="w-5 h-5" />,
  Restaurant: <UtensilsCrossed className="w-5 h-5" />,
  "Air Conditioning": <Wind className="w-5 h-5" />,
  "Fitness Center": <Dumbbell className="w-5 h-5" />,
  "Swimming Pool": <Waves className="w-5 h-5" />,
  TV: <Tv className="w-5 h-5" />,
  default: <Check className="w-5 h-5" />,
};

export async function generateStaticParams() {
  return staticHotelsForParamGeneration.map((hotel) => ({
    id: hotel.id,
  }));
}

export default async function HotelPage({ params }: { params: { id: string } }) {
  const hotel = await getHotelById(params.id);

  if (!hotel) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline mb-2">{hotel.name}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
            <span>({hotel.reviews.length} reviews)</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>{hotel.location}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Carousel className="rounded-lg overflow-hidden shadow-lg">
            <CarouselContent>
              {hotel.gallery && hotel.gallery.length > 0 ? (
                hotel.gallery.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-96">
                      <Image
                        src={src}
                        alt={`${hotel.name} gallery image ${index + 1}`}
                        data-ai-hint="hotel interior"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                 <CarouselItem>
                    <div className="relative h-96">
                      <Image
                        src="https://picsum.photos/800/600"
                        alt="Placeholder image"
                        data-ai-hint="hotel exterior"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="row-start-3 lg:row-start-auto lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Reserve your stay</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">
                ${hotel.price}{" "}
                <span className="text-base font-normal text-muted-foreground">
                  / night
                </span>
              </p>
              <Badge className="bg-green-100 text-green-800 text-lg py-1 px-4 mb-4">
                Best Price Guarantee
              </Badge>
              {hotel.web_url && (
                <Button asChild className="w-full">
                  <Link href={hotel.web_url} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    View on TripAdvisor
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>About this hotel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground/80">{hotel.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hotel.amenities.map((amenity, index) => (
                <div key={`${amenity.name}-${index}`} className="flex items-center gap-3">
                  {amenityIcons[amenity.name] || amenityIcons.default}
                  <span className="text-foreground">{amenity.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Good to know</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-muted-foreground">
                  <Star className="w-5 h-5" />
                  Hotel Class
                </h4>
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
                   <span className="ml-2 text-sm">({hotel.rating.toFixed(1)})</span>
                </div>
              </div>
               {hotel.styles && hotel.styles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-muted-foreground">
                    <Building className="w-5 h-5" />
                    Hotel Style
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {hotel.styles.map((style, index) => (
                      <Badge key={`${style}-${index}`} variant="outline">{style}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {hotel.spoken_languages && hotel.spoken_languages.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-muted-foreground">
                    <Languages className="w-5 h-5" />
                    Languages Spoken
                  </h4>
                  <p>{hotel.spoken_languages.join(', ')}</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      <Separator className="my-12" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold font-headline mb-6">Reviews</h2>
          <div className="space-y-6">
            {hotel.reviews.length > 0 ? hotel.reviews.map((review, index) => (
              <Card key={index} className="bg-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{review.author}</CardTitle>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            )) : <p>No reviews yet.</p>}
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-3xl font-bold font-headline mb-6">Location</h2>
          <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg">
             <Image
                src="https://picsum.photos/800/600"
                alt="Map showing hotel location"
                data-ai-hint="map location"
                fill
                className="object-cover"
              />
          </div>
        </div>
      </div>
    </div>
  );
}
