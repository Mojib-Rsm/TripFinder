import { BedDouble, Calendar, Users, Search, Star, Info, MapPin } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import HotelSearchForm from "./hotel-search-form";


const TripSearchForm = () => {
  return (
    <div className="text-gray-800">
      <div className="grid grid-cols-12 gap-2 mb-4">
        <div className="col-span-12 md:col-span-4 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Where to?" className="h-12 pl-10 bg-gray-100 border-gray-300" />
        </div>
        <div className="col-span-6 md:col-span-2">
           <Button variant="outline" className="w-full h-12 text-muted-foreground justify-start font-normal border-gray-300">
             <Calendar className="mr-2" />
             Select date
           </Button>
        </div>
        <div className="col-span-6 md:col-span-2">
           <Button variant="outline" className="w-full h-12 text-muted-foreground justify-start font-normal border-gray-300">
             <Calendar className="mr-2" />
             Select date
           </Button>
        </div>
        <div className="col-span-12 md:col-span-2">
           <Button variant="outline" className="w-full h-12 text-muted-foreground justify-start font-normal border-gray-300">
            <Users className="mr-2"/> 1 room, 2 adults
           </Button>
        </div>
        <div className="col-span-12 md:col-span-2">
            <Button size="lg" className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2" />
                Search
            </Button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Checkbox id="work-travel" className="border-gray-400" />
          <label htmlFor="work-travel" className="flex items-center gap-1.5">
            I'm traveling for work
            <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
          </label>
        </div>
        <div className="flex items-center gap-4">
            <span>Star Rating</span>
            <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" className="px-3 border-gray-300">≤ 2 <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" /></Button>
                <Button size="sm" variant="outline" className="px-3 border-gray-300">3 <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" /></Button>
                <Button size="sm" variant="outline" className="px-3 border-gray-300">4 <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" /></Button>
                <Button size="sm" variant="outline" className="px-3 border-gray-300">5 <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" /></Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TripSearchForm;
