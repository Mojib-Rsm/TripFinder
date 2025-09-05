
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
import {
  Calendar as CalendarIcon,
  ArrowRight,
  Search,
  BedDouble,
  Plane,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import AirportInput from "./airport-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";

const flightFormSchema = z.object({
  origin: z.string().length(3, "Please select a valid origin airport."),
  destination: z.string().length(3, "Please select a valid destination airport."),
  depart_date: z.date({
    required_error: "A departure date is required.",
  }),
  return_date: z.date().optional(),
});

const hotelFormSchema = z.object({
  location: z.string().min(2, "Please enter a location."),
  checkin_date: z.date({
    required_error: "A check-in date is required.",
  }),
  checkout_date: z.date({
    required_error: "A check-out date is required.",
  }),
});

const TripSearchForm = () => {
  const router = useRouter();

  const flightForm = useForm<z.infer<typeof flightFormSchema>>({
    resolver: zodResolver(flightFormSchema),
  });

  const hotelForm = useForm<z.infer<typeof hotelFormSchema>>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      location: "",
    },
  });

  function onFlightSubmit(values: z.infer<typeof flightFormSchema>) {
    const params = new URLSearchParams();
    params.set("origin", values.origin);
    params.set("destination", values.destination);
    params.set("depart_date", format(values.depart_date, "yyyy-MM-dd"));
    if (values.return_date) {
      params.set("return_date", format(values.return_date, "yyyy-MM-dd"));
    }
    router.push(`/flights?${params.toString()}`);
  }

  function onHotelSubmit(values: z.infer<typeof hotelFormSchema>) {
    const params = new URLSearchParams();
    params.set("location", values.location);
    params.set("check_in", format(values.checkin_date, "yyyy-MM-dd"));
    params.set("check_out", format(values.checkout_date, "yyyy-MM-dd"));
    router.push(`/hotels?${params.toString()}`);
  }

  return (
    <div className="text-gray-800">
      <Tabs defaultValue="flights">
        <TabsList className="grid w-full grid-cols-2 bg-gray-200">
          <TabsTrigger value="flights">
            <Plane className="w-4 h-4 mr-2" /> Flights
          </TabsTrigger>
          <TabsTrigger value="hotels">
            <BedDouble className="w-4 h-4 mr-2" /> Hotels
          </TabsTrigger>
        </TabsList>
        <TabsContent value="flights">
          <Form {...flightForm}>
            <form
              onSubmit={flightForm.handleSubmit(onFlightSubmit)}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start pt-4"
            >
              <div className="md:col-span-5 grid grid-cols-11 items-center gap-2">
                <div className="col-span-5">
                  <FormField
                    control={flightForm.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <AirportInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Origin"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1 text-center">
                  <ArrowRight className="w-5 h-5 text-muted-foreground mx-auto" />
                </div>
                <div className="col-span-5">
                  <FormField
                    control={flightForm.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <AirportInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Destination"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="md:col-span-5 grid grid-cols-2 gap-2">
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
                                "h-14 text-base bg-gray-100 font-normal justify-start",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Departure</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                                "h-14 text-base bg-gray-100 font-normal justify-start",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Return</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                              (flightForm.getValues("depart_date") ||
                                new Date(new Date().setHours(0, 0, 0, 0)))
                            }
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
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold"
                >
                  <Search className="w-5 h-5 mr-2 md:hidden" />
                  Search Flights
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="hotels">
          <Form {...hotelForm}>
            <form
              onSubmit={hotelForm.handleSubmit(onHotelSubmit)}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start pt-4"
            >
              <div className="md:col-span-5">
                <FormField
                  control={hotelForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter an area or hotel name"
                          className="h-14 text-base bg-gray-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-5 grid grid-cols-2 gap-2">
                <FormField
                  control={hotelForm.control}
                  name="checkin_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "h-14 text-base bg-gray-100 font-normal justify-start",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Check-in</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={hotelForm.control}
                  name="checkout_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "h-14 text-base bg-gray-100 font-normal justify-start",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Check-out</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                              (hotelForm.getValues("checkin_date") ||
                                new Date(new Date().setHours(0, 0, 0, 0)))
                            }
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
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold"
                >
                   <Search className="w-5 h-5 mr-2 md:hidden" />
                  Search Hotels
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
