
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-1/3 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form Skeleton */}
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <Skeleton className="h-8 w-1/2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Info Skeleton */}
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
             <div className="bg-white p-8 rounded-lg shadow-md space-y-4">
                <Skeleton className="h-8 w-1/2 mb-6" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
            </div>
        </div>
      </div>
    </div>
  );
}

