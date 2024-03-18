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

interface IUserSidebarActions {
  microphone: boolean;
  camera: boolean;
  screen: boolean;
}

interface SideBarSettingsProps {
  videoMediaStream: MediaStream | null;
}

const userSidebarActionsDefault: IUserSidebarActions = {
  microphone: true,
  camera: true,
  screen: true,
};

const SideBarSettings = ({ videoMediaStream }: SideBarSettingsProps) => {
  const [userSidebarActions, setUserSidebarActions] =
    useState<IUserSidebarActions>(
      userSidebarActionsDefault as IUserSidebarActions
    );

  function handleToogleAction(
    action: keyof IUserSidebarActions,
    state: boolean
  ) {
    setUserSidebarActions((prev) => {
      return {
        ...prev,
        [action]: !state,
      };
    });
  }

  function toggleMicrophone() {
    videoMediaStream
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = userSidebarActions.microphone));

    handleToogleAction("microphone", userSidebarActions.microphone);
  }

  function toggleCamera() {
    videoMediaStream
      ?.getVideoTracks()
      .forEach((track) => (track.enabled = userSidebarActions.camera));

    handleToogleAction("camera", userSidebarActions.camera);
  }

  return (
    <div className="w-full bg-slate-900 py-2 px-5 rounded-md">
      <div className="flex items-center justify-center">
        <div className="space-x-2">
          <Button
            name="microphone"
            size="icon"
            variant="outline"
            onClick={toggleMicrophone}
            className={twMerge(
              !userSidebarActions.microphone &&
                "border-red-400 text-red-400 hover:text-red-400",
              "bg-secondary"
            )}
          >
            {userSidebarActions.microphone && <Mic className="size-6" />}
            {!userSidebarActions.microphone && <MicOff className="size-6" />}
          </Button>

          <Button
            name="camera"
            size="icon"
            variant="outline"
            onClick={toggleCamera}
            className={twMerge(
              !userSidebarActions.camera &&
                "border-red-400 text-red-400 hover:text-red-400",
              "bg-secondary"
            )}
          >
            {userSidebarActions.camera && <Camera className="size-6" />}
            {!userSidebarActions.camera && <CameraOff className="size-6" />}
          </Button>

          <Button
            name="screen"
            size="icon"
            variant="outline"
            onClick={() =>
              handleToogleAction("screen", userSidebarActions.screen)
            }
            className={twMerge(
              !userSidebarActions.screen &&
                "border-red-400 text-red-400 hover:text-red-400",
              "bg-secondary"
            )}
          >
            {userSidebarActions.screen && <ScreenShare className="size-6" />}
            {!userSidebarActions.screen && (
              <ScreenShareOff className="size-6" />
            )}
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
