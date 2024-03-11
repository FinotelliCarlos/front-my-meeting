"use client";

import { Button } from "@/components/ui/button";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Phone,
  ScreenShare,
  ScreenShareOff,
} from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface IRoomActions {
  microphone: boolean;
  camera: boolean;
  screen: boolean;
}

const RoomActionsDefault: IRoomActions = {
  microphone: true,
  camera: true,
  screen: true,
};

const SideBarSettings = () => {
  const [roomActions, setRoomActions] = useState<IRoomActions>(
    RoomActionsDefault as IRoomActions
  );

  const handleToogleAction = (action: keyof IRoomActions, state: boolean) => {
    setRoomActions((prev) => {
      return {
        ...prev,
        [action]: !state,
      };
    });
  };

  return (
    <div className="w-full bg-slate-900 py-2 px-5 rounded-md">
      <div className="flex items-center justify-center">
        <div className="space-x-2">
          <Button
            name="microphone"
            size="icon"
            variant="outline"
            onClick={() =>
              handleToogleAction("microphone", roomActions.microphone)
            }
            className={twMerge(
              !roomActions.microphone &&
                "border-red-400 text-red-400 hover:text-red-400",
              "bg-secondary"
            )}
          >
            {roomActions.microphone && <Mic className="size-6" />}
            {!roomActions.microphone && <MicOff className="size-6" />}
          </Button>

          <Button
            name="camera"
            size="icon"
            variant="outline"
            onClick={() => handleToogleAction("camera", roomActions.camera)}
            className={twMerge(
              !roomActions.camera &&
                "border-red-400 text-red-400 hover:text-red-400",
              "bg-secondary"
            )}
          >
            {roomActions.camera && <Camera className="size-6" />}
            {!roomActions.camera && <CameraOff className="size-6" />}
          </Button>

          <Button
            name="screen"
            size="icon"
            variant="outline"
            onClick={() => handleToogleAction("screen", roomActions.screen)}
            className={twMerge(
              !roomActions.screen &&
                "border-red-400 text-red-400 hover:text-red-400",
              "bg-secondary"
            )}
          >
            {roomActions.screen && <ScreenShare className="size-6" />}
            {!roomActions.screen && <ScreenShareOff className="size-6" />}
          </Button>

          <Button
            name="call"
            size="icon"
            variant="outline"
            className="bg-secondary text-green-400 hover:text-red-400"
          >
            <Phone className="size-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SideBarSettings;
