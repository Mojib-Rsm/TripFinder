import HotelSearchForm from "@/components/hotel-search-form";
import PersonalizedRecommendations from "@/components/personalized-recommendations";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white">
        <Image
          src="https://picsum.photos/1600/900"
          alt="Beautiful travel destination"
          data-ai-hint="beach landscape"
          fill
          className="object-cover -z-10 brightness-50"
          priority
        />
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold font-headline mb-4 animate-fade-in-down">
            Find Your Next Stay
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Search deals on hotels, homes, and much more...
          </p>
          <div className="max-w-4xl mx-auto">
            <HotelSearchForm />
          </div>
        </div>
      </section>

      <PersonalizedRecommendations />
    </>
  );
}
