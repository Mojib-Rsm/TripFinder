
import { Skeleton } from "@/components/ui/skeleton";

export default function HotelLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[400px] w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-[192px] w-full" />
            <Skeleton className="h-[192px] w-full" />
            <Skeleton className="h-[192px] w-full" />
            <Skeleton className="h-[192px] w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>

          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
