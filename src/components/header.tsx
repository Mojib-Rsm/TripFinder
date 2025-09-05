import Link from "next/link";
import { Logo } from "@/components/icons";

const Header = () => {
  return (
    <header className="py-4 px-6 md:px-12 bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            TripFinder
          </h1>
        </Link>
        {/* Future navigation links can be added here */}
      </div>
    </header>
  );
};

export default Header;
