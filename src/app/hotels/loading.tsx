
import { Skeleton } from "@/components/ui/skeleton";

export default function HotelsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
