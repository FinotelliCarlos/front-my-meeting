import { Skeleton } from "@/components/ui/skeleton";

const RoomLoading = () => {
  return (
    <>
      <Skeleton className="md:w-3/4 w-full bg-secondary md:h-full h-3/4 rounded-md grid grid-cols-2 p-2 gap-2">
        <Skeleton className="w-full bg-slate-900" />
        <Skeleton className="w-full bg-slate-900" />
        <Skeleton className="w-full bg-slate-900" />
        <Skeleton className="w-full bg-slate-900" />
      </Skeleton>

      <Skeleton className="bg-secondary rounded-md flex justify-end flex-col w-full md:max-w-[400px] min-w-[400px] h-[20vh] md:h-full" />
    </>
  );
};

export default RoomLoading;
