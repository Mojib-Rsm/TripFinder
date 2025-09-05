import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, BedDouble, Camera, Utensils, Plane, Sailboat } from "lucide-react";
import HotelSearchForm from "./hotel-search-form";

const TripSearchForm = () => {
  return (
    <Tabs defaultValue="search-all" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-transparent p-0">
        <TabsTrigger value="search-all" className="text-white flex gap-2">
          <Home className="w-5 h-5"/>
          Search All
        </TabsTrigger>
        <TabsTrigger value="hotels" className="text-white flex gap-2">
            <BedDouble className="w-5 h-5"/>
            Hotels
        </TabsTrigger>
        <TabsTrigger value="things-to-do" className="text-white flex gap-2">
            <Camera className="w-5 h-5"/>
            Things to Do
        </TabsTrigger>
        <TabsTrigger value="restaurants" className="text-white flex gap-2">
            <Utensils className="w-5 h-5"/>
            Restaurants
        </TabsTrigger>
        <TabsTrigger value="flights" className="text-white flex gap-2">
            <Plane className="w-5 h-5"/>
            Flights
        </TabsTrigger>
        <TabsTrigger value="cruises" className="text-white flex gap-2">
            <Sailboat className="w-5 h-5"/>
            Cruises
        </TabsTrigger>
      </TabsList>
      <div className="pt-4">
        <TabsContent value="search-all">
          <HotelSearchForm />
        </TabsContent>
        <TabsContent value="hotels">
          <HotelSearchForm />
        </TabsContent>
        <TabsContent value="things-to-do">
          <HotelSearchForm />
        </TabsContent>
        <TabsContent value="restaurants">
          <HotelSearchForm />
        </TabsContent>
        <TabsContent value="flights">
          <HotelSearchForm />
        </TabsContent>
        <TabsContent value="cruises">
          <HotelSearchForm />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default TripSearchForm;
