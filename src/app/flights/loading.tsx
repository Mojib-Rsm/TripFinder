import { Skeleton } from "@/components/ui/skeleton";

export default function FlightsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-1/3 mb-2" />
      <Skeleton className="h-6 w-1/4 mb-8" />
      
      <div className="grid grid-cols-1 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-card p-6 rounded-lg space-y-4 border">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-8 w-1/5" />
            </div>
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-10 w-1/4" />
            </div>
            <div className="flex justify-between items-center border-t pt-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
