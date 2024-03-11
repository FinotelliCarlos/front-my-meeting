import { Badge } from "@/components/ui/badge";
import Chat from "../_components/chat";
import RoomLoading from "../_components/room-loading";
import SideBarSettings from "../_components/sidebar-settings";

interface RoomParams {
  params: {
    id: string;
  };
}

const Room = async ({ params: { id } }: RoomParams) => {
  const loading = false;

  return (
    <div className="flex-1 flex flex-col h-full justify-between container gap-3">
      <div className="h-full flex flex-col md:flex-row gap-3">
        {!loading ? (
          <>
            <div className="w-full bg-secondary h-full rounded-md grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
              {Array.from({ length: 30 }).map((item: any) => {
                return (
                  <div
                    key={`${item + 1}`}
                    className="bg-slate-900 aspect-video w-full h-full rounded-sm relative"
                  >
                    <video className="h-full w-full"></video>
                    <Badge
                      className="absolute bottom-2 left-1"
                      variant="secondary"
                    >
                      Carlos
                    </Badge>
                  </div>
                );
              })}
            </div>
            <div className="bg-secondary rounded-md flex justify-end flex-col">
              <Chat />
            </div>
          </>
        ) : (
          <RoomLoading />
        )}
      </div>

      <SideBarSettings />
    </div>
  );
};

export default Room;
