import { Skeleton } from '@/components/ui/skeleton';

const ProductCardSkeleton = () => (
  <div className="bg-background overflow-hidden">
    <Skeleton className="aspect-[3/4] w-full rounded-none" />
    <div className="p-8 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-7 w-20" />
      </div>
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;
