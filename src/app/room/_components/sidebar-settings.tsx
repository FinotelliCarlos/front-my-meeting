"use client";

import { Button } from "@/components/ui/button";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Monitor,
  Phone,
  ScreenShare,
} from "lucide-react";
import { MutableRefObject, useState } from "react";
import { twMerge } from "tailwind-merge";

interface SideBarSettingsProps {
  videoMediaStream: MediaStream | null;
  peerConnections: MutableRefObject<Record<string, RTCPeerConnection>>;
  currUserVideoStreaming: MutableRefObject<HTMLVideoElement | null>;
  handleLogout: () => void;
}

const SideBarSettings = ({
  videoMediaStream,
  peerConnections,
  currUserVideoStreaming,
  handleLogout,
}: SideBarSettingsProps) => {
  const [isMicrophoneOn, setIsMicrophoneOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isShareScreen, setIsShareScreen] = useState<boolean>(false);

  function toggleMicrophone() {
    setIsMicrophoneOn((prevState) => !prevState);

    videoMediaStream?.getAudioTracks().forEach((track) => {
      track.enabled = !isMicrophoneOn;
    });

    if (videoMediaStream) {
      Object.values(peerConnections.current).forEach((peerConnection) => {
        peerConnection.getSenders().forEach((sender) => {
          if (sender.track?.kind === "audio") {
            if (videoMediaStream?.getAudioTracks().length > 0) {
              sender.replaceTrack(
                videoMediaStream
                  ?.getAudioTracks()
                  .find((track) => track.kind === "audio") || null
              );
            }
          }
        });
      });
    }
  }

  function toggleCamera() {
    setIsCameraOn((prevState) => !prevState);

    if (videoMediaStream) {
      videoMediaStream.getVideoTracks().forEach((track) => {
        track.enabled = !isCameraOn;
      });

      Object.values(peerConnections.current).forEach((peerConnection) => {
        peerConnection.getSenders().forEach((sender) => {
          if (sender.track?.kind === "video") {
            sender.replaceTrack(
              videoMediaStream
                ?.getVideoTracks()
                .find((track) => track.kind === "video") || null
            );
          }
        });
      });
    }
  }

  async function toggleShareScreen() {
    setIsShareScreen((prevState) => !prevState);

    if (!isShareScreen) {
      const videoShareScreen = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      if (currUserVideoStreaming.current)
        currUserVideoStreaming.current.srcObject = videoShareScreen;

      Object.values(peerConnections.current).forEach((peerConnections) => {
        peerConnections.getSenders().forEach((sender) => {
          if (sender.track?.kind === "video") {
            sender.replaceTrack(videoShareScreen.getVideoTracks()[0]);
          }
        });
      });
      return;
    }

    if (currUserVideoStreaming.current) {
      currUserVideoStreaming.current.srcObject = videoMediaStream;

      if (videoMediaStream) {
        Object.values(peerConnections.current).forEach((peerConnections) => {
          peerConnections.getSenders().forEach((sender) => {
            if (sender.track?.kind === "video") {
              sender.replaceTrack(videoMediaStream?.getVideoTracks()[0]);
            }
          });
        });
      }

      setIsShareScreen(false);
    }
  }

  return (
    <div className="w-full bg-slate-900 py-2 px-5 rounded-md">
      <div className="flex items-center justify-center">
        <div className="flex flex-row gap-2">
          <Button
            name="microphone"
            size="icon"
            variant="outline"
            onClick={toggleMicrophone}
            className={twMerge(
              !isMicrophoneOn &&
                "border-red-400 text-red-400 hover:text-red-400",
              "bg-secondary"
            )}
          >
            {isMicrophoneOn && <Mic className="size-6" />}
            {!isMicrophoneOn && <MicOff className="size-6" />}
          </Button>

          <Button
            name="camera"
            size="icon"
            variant="outline"
            onClick={toggleCamera}
            className={twMerge(
              !isCameraOn && "border-red-400 text-red-400 hover:text-red-400",
              "bg-secondary"
            )}
          >
            {isCameraOn && <Camera className="size-6" />}
            {!isCameraOn && <CameraOff className="size-6" />}
          </Button>

          <div className="hidden md:block">
            <Button
              name="screen"
              size="icon"
              variant="outline"
              onClick={toggleShareScreen}
              className={twMerge(
                isShareScreen && "text-red-400 hover:text-red-400",
                "bg-secondary"
              )}
            >
              {!isShareScreen && <ScreenShare className="size-6" />}
              {isShareScreen && (
                <div className="text-xs relative">
                  <Monitor className="size-6" />
                  <div className="size-3 rounded-full bg-red-400 animate-pulse absolute top-[-2px] right-[-2px]" />
                </div>
              )}
            </Button>
          </div>

          <Button
            name="call"
            size="icon"
            variant="outline"
            className="bg-secondary text-green-400 hover:text-red-400"
            onClick={handleLogout}
          >
            <Phone className="size-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SideBarSettings;
