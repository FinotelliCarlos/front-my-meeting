"use client";

import { Badge } from "@/components/ui/badge";
import useSocket from "@/context/socket-context";
import { useEffect, useRef, useState } from "react";
import Chat from "../_components/chat";
import RoomLoading from "../_components/room-loading";
import SideBarSettings from "../_components/sidebar-settings";

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

type RemoteStreamsProps = Array<{
  media: MediaStream;
  userName: string;
}>;

const Room = ({ params: { id } }: RoomParams) => {
  const { socket } = useSocket();

  const currUserVideoStreaming = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

  const [remoteStreams, setRemoreStreams] = useState<RemoteStreamsProps>([]);
  const [videoMediaStream, setVideoMediaStream] = useState<MediaStream | null>(
    null
  );

  async function handleUserMedia() {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    return video;
  }

  async function handleUserLocalCamera() {
    const video = await handleUserMedia();

    setVideoMediaStream(video);

    if (currUserVideoStreaming.current) {
      currUserVideoStreaming.current.srcObject = video;
    }
  }

  async function initRemoteUserCamera() {
    const video = await handleUserMedia();

    return video;
  }

  async function handleCreatePeerConnection(
    socketId: string,
    createOffer: boolean
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
      videoMediaStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, videoMediaStream);
      });
    } else {
      const video = await initRemoteUserCamera();

      video.getTracks().forEach((track) => {
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
      const remoteStream = event.streams[0];

      setRemoreStreams((prev) => {
        return [
          ...prev,
          {
            media: remoteStream,
            userName: sessionStorage.getItem("userName") || "",
          },
        ];
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

  const loading = false;

  useEffect(() => {
    socket?.on("connect", async () => {
      socket.emit("subscribe", { roomId: id, socketId: socket.id });

      await handleUserLocalCamera();
    });

    socket?.on("new user", (data) => {
      socket.emit("new user start", {
        to: data.socketId,
        sender: socket.id,
      });

      handleCreatePeerConnection(data.socketId, false);
    });

    socket?.on("new user start", (data) => {
      handleCreatePeerConnection(data.sender, true);
    });

    socket?.on("sdp", (data) => handleAnswer(data));

    socket?.on("ice candidates", (data) => handleIceCandidates(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, id]);

  return (
    <div className="flex-1 flex flex-col h-full justify-between container gap-3">
      <div className="h-full flex flex-col md:flex-row gap-3">
        {!loading ? (
          <>
            <div className="w-full bg-secondary h-full grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
              {remoteStreams.map((stream, index) => {
                return (
                  <div key={index} className="bg-slate-900 rounded-md relative">
                    <video
                      className="h-full w-full aspect-video object-cover rounded-md mirror-mode"
                      autoPlay
                      playsInline
                      ref={(video) => {
                        if (video && video.srcObject !== stream.media) {
                          video.srcObject = stream.media;
                        }
                      }}
                    />
                    <Badge
                      className="absolute bottom-2 left-1"
                      variant="secondary"
                    >
                      {stream.userName}
                    </Badge>
                  </div>
                );
              })}
            </div>
            <div className="bg-secondary rounded-md flex justify-end flex-col">
              <Chat roomId={id} />
            </div>
          </>
        ) : (
          <RoomLoading />
        )}
      </div>

      <SideBarSettings videoMediaStream={videoMediaStream} />
    </div>
  );
};

export default Room;
