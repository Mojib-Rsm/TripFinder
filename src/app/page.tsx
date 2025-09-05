
import TripSearchForm from "@/components/trip-search-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PersonalizedRecommendations from "@/components/personalized-recommendations";
import { getHotelsByLocation } from "@/lib/data";
import HotelCard from "@/components/hotel-card";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const popularDestinations = [
  {
    name: "Europe",
    img: "https://picsum.photos/300/400?random=1",
    aiHint: "paris eiffel tower",
  },
  {
    name: "United Kingdom",
    img: "https://picsum.photos/300/400?random=2",
    aiHint: "london big ben",
  },
  {
    name: "Thailand",
    img: "https://picsum.photos/300/400?random=3",
    aiHint: "thailand beach",
  },
  {
    name: "Indonesia",
    img: "https://picsum.photos/300/400?random=4",
aiHint: "indonesia temple"
  },
];

export default async function Home() {

  const popularHotels = await getHotelsByLocation("Cox's Bazar");
  return (
    <>
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center text-center text-white">
        <Image
          src="https://picsum.photos/1600/900"
          alt="Beautiful travel destination"
          data-ai-hint="santorini cityscape"
          fill
          className="object-cover -z-10"
          priority
        />
        <div className="absolute inset-0 bg-blue-600/40 -z-10" />

        <div className="container mx-auto px-4 -mt-16">
          <h2 className="text-4xl md:text-5xl font-bold font-headline mb-8">
            Hotels & Homes<span className="text-yellow-400">.</span>
          </h2>
          <div className="max-w-5xl mx-auto bg-white p-4 rounded-lg shadow-2xl">
            <TripSearchForm />
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-32 h-32 hidden md:block">
                 <Image
                    src="https://picsum.photos/200/200"
                    alt="Welcome illustration"
                    data-ai-hint="happy traveler"
                    width={128}
                    height={128}
                    className="rounded-lg"
                  />
              </div>
              <div className="ml-8">
                <h3 className="text-2xl font-bold text-gray-800">
                  Welcome aboard! Enjoy a 15% discount on stays!
                </h3>
                <ul className="mt-2 text-gray-600 space-y-1">
                  <li>✓ Snag a promo code and save up to 10%</li>
                  <li>
                    ✓ Download the app to earn Trip Coins worth around 5% of
                    your booking total, with a max. of BDT 800
                  </li>
                </ul>
              </div>
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Claim Discount &gt;
            </Button>
          </div>
        </div>
      </section>
      
      <PersonalizedRecommendations />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold font-headline mb-8">More places to stay in Cox's Bazar</h3>
           {popularHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularHotels.slice(0, 4).map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <p>Could not load popular hotels at this time.</p>
          )}
        </div>
      </section>
      
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold font-headline mb-8">Inspiration for your next trip</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {popularDestinations.map(dest => (
              <Link href={`/search?location=${dest.name}`} key={dest.name}>
                <Card className="overflow-hidden group">
                  <div className="relative h-72">
                    <Image src={dest.img} alt={dest.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={dest.aiHint}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardContent className="p-4 absolute bottom-0">
                    <h4 className="text-xl font-bold text-white">{dest.name}</h4>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
    </>
  );
}
