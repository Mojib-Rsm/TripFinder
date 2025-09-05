
import Link from "next/link";
import { Button } from "./ui/button";
import { CircleUserRound, Ellipsis } from "lucide-react";

const Header = () => {
  return (
    <header className="py-3 px-6 md:px-12 bg-blue-700/90 backdrop-blur-sm border-b border-blue-600/50 sticky top-0 z-50 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">
              TripFinder
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white"><Link href="/search">Hotels & Homes</Link></Button>
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white"><Link href="/search">Flights</Link></Button>
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white"><Link href="/search">Trains</Link></Button>
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white"><Link href="/search">Car Services</Link></Button>
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white"><Link href="/search">Attractions & Tours</Link></Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
              <Ellipsis />
            </Button>
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">List Your Property</Button>
            <span className="text-sm">USD</span>
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Customer Support</Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
              <CircleUserRound className="w-6 h-6"/>
            </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
