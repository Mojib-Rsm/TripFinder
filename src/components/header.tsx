
import Link from "next/link";
import { Button } from "./ui/button";
import { CircleUserRound } from "lucide-react";
import { Logo } from "./icons";

const Header = () => {
  return (
    <header className="py-3 px-6 md:px-12 bg-white/90 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-50 text-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Logo className="w-8 h-8" />
            <h1 className="text-2xl font-bold">
              TripFinder
            </h1>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost"><Link href="/">Home</Link></Button>
            <Button asChild variant="ghost"><Link href="/flights">Flights</Link></Button>
            <Button asChild variant="ghost"><Link href="/hotels">Hotels</Link></Button>
            <Button asChild variant="ghost"><Link href="/">Contact</Link></Button>
        </nav>
        <div className="hidden md:flex items-center gap-4">
            <Button variant="outline">List Your Property</Button>
            <Button variant="primary">
              <CircleUserRound className="w-5 h-5 mr-2"/>
              Login
            </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
