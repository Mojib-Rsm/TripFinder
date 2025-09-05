
import TripSearchForm from "@/components/trip-search-form";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BadgeCheck, ShieldCheck, Star } from "lucide-react";

const whyChooseUs = [
    {
        icon: <Star className="w-10 h-10 text-primary" />,
        title: 'Trusted Reviews',
        description: 'Honest feedback from millions of travelers.'
    },
    {
        icon: <Award className="w-10 h-10 text-primary" />,
        title: 'Best Price Guarantee',
        description: 'Find the best deals on flights worldwide.'
    },
    {
        icon: <ShieldCheck className="w-10 h-10 text-primary" />,
        title: 'Secure Booking',
        description: 'Your data is protected with top-tier security.'
    },
     {
        icon: <BadgeCheck className="w-10 h-10 text-primary" />,
        title: '24/7 Support',
        description: 'We are here to help you anytime, anywhere.'
    }
]

export default async function Home() {
  return (
    <>
      <section className="relative h-[80vh] min-h-[550px] flex items-center justify-center text-center text-white">
        <Image
          src="https://picsum.photos/1600/900"
          alt="Beautiful travel destination"
          data-ai-hint="santorini greece"
          fill
          className="object-cover -z-10"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/20 -z-10" />

        <div className="container mx-auto px-4 -mt-16">
           <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
            Find the best flight deals worldwide.
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Your journey begins here. Search for flights to plan your perfect trip.
          </p>
          <div className="max-w-5xl mx-auto bg-white p-4 rounded-lg shadow-2xl">
            <TripSearchForm />
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold font-headline mb-12">Why Choose Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {whyChooseUs.map(item => (
                    <div key={item.title} className="flex flex-col items-center">
                        <div className="bg-blue-100 p-4 rounded-full mb-4">
                            {item.icon}
                        </div>
                        <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                        <p className="text-muted-foreground">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </>
  );
}
