
import { Skeleton } from "@/components/ui/skeleton";

export default function HotelLoading() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div>
            <Skeleton className="h-10 w-2/3 mb-2" />
            <div className="flex items-center gap-4 mt-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          </div>

          {/* Image Gallery Skeleton */}
          <div className="relative h-[500px] w-full">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>


          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Description Skeleton */}
               <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
               </div>

              {/* Amenities Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
                </div>
              </div>


              {/* Reviews Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="border-b pb-4">
                            <div className="flex justify-between items-center mb-2">
                                <Skeleton className="h-5 w-1/4" />
                                <Skeleton className="h-5 w-1/5" />
                            </div>
                            <Skeleton className="h-5 w-full" />
                        </div>
                    ))}
                </div>
              </div>

            </div>

            {/* Booking Card Skeleton */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
