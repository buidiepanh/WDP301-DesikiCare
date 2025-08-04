import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonProductCard = () => {
  return (
    <div className="w-full h-[354px] bg-transparent flex justify-center">
      <div className="w-[258px] h-full flex flex-col gap-4">
        <Skeleton className="h-[258px] w-[258px] bg-gray-200" />
        <div className="flex flex-col gap-2 ">
          <Skeleton className="h-6 w-[258px] bg-gray-200" />
          <Skeleton className="w-[150px] h-9 bg-gray-200"></Skeleton>
        </div>
      </div>
    </div>
  );
};
