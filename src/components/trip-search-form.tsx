
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
import { Plane, Search, Hotel, CalendarIcon, Users, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

const hotelFormSchema = z.object({
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
});

const flightFormSchema = z.object({
  origin: z.string().min(3, "Please enter a valid origin IATA code."),
  destination: z.string().min(3, "Please enter a valid destination IATA code."),
  depart_date: z.date({
    required_error: "A departure date is required.",
  }),
  return_date: z.date().optional(),
});


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

  const flightForm = useForm<z.infer<typeof flightFormSchema>>({
    resolver: zodResolver(flightFormSchema),
  });

  function onHotelSubmit(values: z.infer<typeof hotelFormSchema>) {
    const { location } = values;
    addSearchToHistory({ location, dates: {} });

    const params = new URLSearchParams();
    params.set("location", location);
    router.push(`/search?${params.toString()}`);
  }

  function onFlightSubmit(values: z.infer<typeof flightFormSchema>) {
    const params = new URLSearchParams({
      origin: values.origin.toUpperCase(),
      destination: values.destination.toUpperCase(),
      depart_date: format(values.depart_date, "yyyy-MM-dd"),
    });

    if (values.return_date) {
      params.append("return_date", format(values.return_date, "yyyy-MM-dd"));
    }

    router.push(`/flights?${params.toString()}`);
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
             <Form {...flightForm}>
                <form
                    onSubmit={flightForm.handleSubmit(onFlightSubmit)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end"
                >
                    <div className="md:col-span-3">
                        <FormField
                        control={flightForm.control}
                        name="origin"
                        render={({ field }) => (
                             <FormItem>
                                <FormControl>
                                    <Input placeholder="Origin (e.g., DAC)" {...field} className="h-14 text-base bg-gray-100"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                     <div className="md:col-span-3">
                        <FormField
                        control={flightForm.control}
                        name="destination"
                        render={({ field }) => (
                             <FormItem>
                                <FormControl>
                                    <Input placeholder="Destination (e.g., JFK)" {...field} className="h-14 text-base bg-gray-100"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <div className="md:col-span-2">
                         <FormField
                            control={flightForm.control}
                            name="depart_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full h-14 justify-start text-left font-normal bg-gray-100 border-0",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Depart date</span>
                                        )}
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </div>
                     <div className="md:col-span-2">
                         <FormField
                            control={flightForm.control}
                            name="return_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full h-14 justify-start text-left font-normal bg-gray-100 border-0",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Return date</span>
                                        )}
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < flightForm.getValues("depart_date")}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </div>
                    <div className="md:col-span-2">
                        <Button type="submit" size="lg" className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold">
                            Search Flights
                        </Button>
                    </div>
                </form>
            </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripSearchForm;
