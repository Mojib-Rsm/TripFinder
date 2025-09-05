
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
import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
});

const TripSearchForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addSearchToHistory } = useSearchHistory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: searchParams.get('location') || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { location } = values;
    addSearchToHistory({ location, dates: {} });

    const params = new URLSearchParams();
    params.set("location", location);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="text-gray-800">
      <Tabs defaultValue="hotels" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-transparent p-0 mb-4">
          <TabsTrigger value="hotels" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">Hotels & Homes</TabsTrigger>
          <TabsTrigger value="flights" disabled>Flights</TabsTrigger>
          <TabsTrigger value="trains" disabled>Trains</TabsTrigger>
          <TabsTrigger value="cars" disabled>Car Services</TabsTrigger>
          <TabsTrigger value="tours" disabled>Attractions & Tours</TabsTrigger>
        </TabsList>
        <TabsContent value="hotels">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2"
                >
                    <div className="md:col-span-10">
                        <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search destinations"
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
                        <Button type="submit" size="lg" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                            <Search className="mr-2 h-5 w-5" />
                            Search
                        </Button>
                    </div>
                </form>
            </Form>
            <div className="flex items-center mt-4">
                <Checkbox id="work-travel" />
                <label htmlFor="work-travel" className="ml-2 text-sm">
                    I'm traveling for work
                </label>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripSearchForm;
