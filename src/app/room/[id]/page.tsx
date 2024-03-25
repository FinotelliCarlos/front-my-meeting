"use client";

import useSocket from "@/context/socket-context";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { twMerge } from "tailwind-merge";
import Chat from "../_components/chat";
import SideBarSettings from "../_components/sidebar-settings";
import FrameVideo from "./_components/frame-video";
import { handleUserMedia } from "./_helper/handle-video-media.helper";

interface IAnswer {
  sender: string;
  description: RTCSessionDescriptionInit;
}

interface ICandidates {
  sender: string;
  candidate: RTCIceCandidate;
}

interface RoomParams {
  params: {
    id: string;
  };
}

export interface RemoteStreamsProps {
  id: string;
  media: MediaStream | null;
  userName: string;
}

const Room = ({ params: { id } }: RoomParams) => {
  const { socket } = useSocket();
  const router = useRouter();

  const currUserVideoStreaming = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

  const [remoteStreams, setRemoteStreams] = useState<RemoteStreamsProps[]>([]);
  const [videoMediaStream, setVideoMediaStream] = useState<MediaStream | null>(
    null
  );

  async function handleUserLocalCamera() {
    const video = await handleUserMedia();

    setVideoMediaStream(video);

    if (currUserVideoStreaming.current) {
      currUserVideoStreaming.current.srcObject = video;
    }
  }

  async function handleCreatePeerConnection(
    socketId: string,
    createOffer: boolean,
    userName: string
  ) {
    const configConnection = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };

    const peer = new RTCPeerConnection(configConnection);

    peerConnections.current[socketId] = peer;

    const peerConnection = peerConnections.current[socketId];

    if (videoMediaStream) {
      videoMediaStream?.getTracks().forEach((track) => {
        peerConnection.addTrack(track, videoMediaStream);
      });
    } else {
      const video = await handleUserMedia();

      video?.getTracks().forEach((track) => {
        peerConnection.addTrack(track, video);
      });
    }

    if (createOffer) {
      const offer = await peerConnection.createOffer();

      await peerConnection.setLocalDescription(offer);

      socket?.emit("sdp", {
        to: socketId,
        sender: socket.id,
        description: peerConnection.localDescription,
      });
    }

    peerConnection.ontrack = (event) => {
      event.streams.forEach((currStreaming) => {
        const dataStream: RemoteStreamsProps = {
          id: socketId,
          media: currStreaming,
          userName,
        };

        setRemoteStreams((prevRemote) => {
          if (!prevRemote.some((stream) => stream.id === socketId)) {
            return [...prevRemote, dataStream];
          }
          return prevRemote;
        });
      });
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice candidates", {
          to: socketId,
          sender: socket.id,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.onsignalingstatechange = (_event) => {
      switch (peerConnection.signalingState) {
        case "closed":
          setRemoteStreams((prevState) =>
            prevState.filter((stream) => stream.id !== socketId)
          );

          break;
      }
    };

    peerConnection.onconnectionstatechange = (_event) => {
      switch (peerConnection.connectionState) {
        case "disconnected":
          setRemoteStreams((prevState) =>
            prevState.filter((remote) => remote.id !== socketId)
          );
        case "failed":
          setRemoteStreams((prevState) =>
            prevState.filter((remote) => remote.id !== socketId)
          );
        case "closed":
          setRemoteStreams((prevState) =>
            prevState.filter((remote) => remote.id !== socketId)
          );
          break;
      }
    };
  }

  async function handleAnswer(data: IAnswer) {
    const peerConnection = peerConnections.current[data.sender];

    if (data.description.type === "offer") {
      await peerConnection.setRemoteDescription(data.description);

      const answer = await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(answer);

      socket?.emit("sdp", {
        to: data.sender,
        sender: socket.id,
        description: peerConnection.localDescription,
      });
    } else if (data.description.type === "answer") {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.description)
      );
    }
  }

  async function handleIceCandidates(data: ICandidates) {
    const peerConnection = peerConnections.current[data.sender];

    if (data.candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  }

  function handleLogout() {
    videoMediaStream?.getTracks().forEach((track) => {
      track.stop();
    });

    Object.values(peerConnections.current).forEach((peerConnection) => {
      peerConnection.close();
    });

    socket?.disconnect();

    router.push("/");
  }

  const userName = useSyncExternalStore(
    () => () => {
      typeof window !== "undefined";
    },
    () => sessionStorage.getItem("userName"),
    () => "Nome do usuário"
  );

  useEffect(() => {
    socket?.on("connect", async () => {
      socket.emit("subscribe", {
        roomId: id,
        socketId: socket.id,
        userName: userName,
      });

      await handleUserLocalCamera();
    });

    socket?.on("new user", (data) => {
      socket.emit("new user start", {
        to: data.socketId,
        sender: socket.id,
        userName: data.userName,
      });

      handleCreatePeerConnection(data.socketId, false, data.userName);
    });

    socket?.on("new user start", (data) => {
      handleCreatePeerConnection(data.sender, true, data.userName);
    });

    socket?.on("sdp", (data) => handleAnswer(data));

    socket?.on("ice candidates", (data) => handleIceCandidates(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <div className="flex-1 flex flex-col h-full justify-between container gap-3">
      <div className="h-full flex flex-col md:flex-row gap-3 relative">
        <div
          className={twMerge(
            remoteStreams.length >= 1 && "md:grid-cols-2",
            remoteStreams.length >= 3 && "md:grid-cols-2",
            `w-full bg-secondary h-full grid-cols-1 grid gap-2 p-2 rounded-md`
          )}
        >
          <FrameVideo
            videoChildren={
              <video
                className="h-full w-full aspect-video object-cover rounded-md"
                autoPlay
                playsInline
                ref={currUserVideoStreaming}
              />
            }
            userName={userName || ""}
          />

          {remoteStreams.map((stream, index) => {
            return (
              <FrameVideo
                key={index}
                videoChildren={
                  <video
                    className="h-full w-full aspect-video object-cover rounded-md"
                    autoPlay
                    playsInline
                    ref={(video) => {
                      if (video && video.srcObject !== stream.media) {
                        video.srcObject = stream.media;
                      }
                    }}
                  />
                }
                userName={stream.userName}
              />
            );
          })}
        </div>
        <div className="absolute right-3 top-3">
          <Chat roomId={id} />
        </div>
      </div>

      <SideBarSettings
        videoMediaStream={videoMediaStream}
        peerConnections={peerConnections}
        currUserVideoStreaming={currUserVideoStreaming}
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default Room;
