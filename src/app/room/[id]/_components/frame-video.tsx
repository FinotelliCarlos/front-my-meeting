import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

const FrameVideo = ({
  videoChildren,
  userName,
}: {
  videoChildren: ReactNode;
  userName: string;
}) => {
  return (
    <div className="bg-slate-900 rounded-md relative">
      {videoChildren}
      <Badge className="absolute bottom-2 left-1" variant="secondary">
        {userName}
      </Badge>
    </div>
  );
};

export default FrameVideo;
