import { Skeleton } from '@/components/ui/skeleton';

const PageSkeleton = () => (
  <div className="min-h-screen">
    {/* Hero skeleton */}
    <Skeleton className="w-full h-[60vh] rounded-none" />
    {/* Content skeletons */}
    <div className="section-padding py-16 space-y-8">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-72 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PageSkeleton;
