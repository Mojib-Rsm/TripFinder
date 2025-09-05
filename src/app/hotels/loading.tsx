
import { Skeleton } from "@/components/ui/skeleton";

export default function HotelsLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        
        {/* AI Recommendations Skeleton */}
        <div className="mb-8">
           <Skeleton className="h-48 w-full rounded-lg" />
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3 bg-card">
              <Skeleton className="h-48 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-1/2" />
              </div>
              <div className="flex justify-between items-center pt-2">
                 <Skeleton className="h-6 w-1/4" />
                 <Skeleton className="h-10 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
