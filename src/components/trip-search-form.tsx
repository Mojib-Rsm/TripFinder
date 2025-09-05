
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plane, Search, Hotel } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useEffect } from "react";

const hotelFormSchema = z.object({
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
});

const FlightWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tpembd.com/content?currency=bdt&trs=450435&shmarker=592431&show_hotels=true&powered_by=true&locale=en&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=%2332a8dd&color_icons=%2332a8dd&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&no_labels=&plain=true&promo_id=7879&campaign_id=100';
    script.async = true;
    script.charset = 'utf-8';

    const container = document.getElementById('flight-widget-container');
    if (container) {
      container.appendChild(script);
    }
    
    return () => {
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    }
  }, []);

  return <div id="flight-widget-container"></div>;
}


const TripSearchForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addSearchToHistory } = useSearchHistory();

  const hotelForm = useForm<z.infer<typeof hotelFormSchema>>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      location: searchParams.get('location') || "",
    },
  });


  function onHotelSubmit(values: z.infer<typeof hotelFormSchema>) {
    const { location } = values;
    addSearchToHistory({ location, dates: {} });

    const params = new URLSearchParams();
    params.set("location", location);
    router.push(`/search?${params.toString()}`);
  }


  return (
    <div className="text-gray-800">
      <Tabs defaultValue="hotels" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 mb-4 max-w-xs mx-auto md:mx-0">
          <TabsTrigger value="hotels" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none flex items-center gap-2"><Hotel />Hotels</TabsTrigger>
          <TabsTrigger value="flights" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none flex items-center gap-2"><Plane/>Flights</TabsTrigger>
        </TabsList>
        <TabsContent value="hotels">
            <Form {...hotelForm}>
                <form
                    onSubmit={hotelForm.handleSubmit(onHotelSubmit)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end"
                >
                    <div className="md:col-span-10">
                        <FormField
                        control={hotelForm.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Enter a destination or hotel"
                                    {...field}
                                    className="h-14 text-base bg-gray-100 rounded-md pl-12 pr-4 text-foreground w-full"
                                />
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Button type="submit" size="lg" className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold">
                            Search Hotels
                        </Button>
                    </div>
                </form>
            </Form>
        </TabsContent>
        <TabsContent value="flights">
            <FlightWidget />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripSearchForm;
